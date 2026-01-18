/**
 * Add New Location Form
 * Protected admin route for adding new film locations
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';
import { PROPERTY_TYPES, TN_COUNTIES } from '@/types/database';

export default function AddLocationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, uploading: false });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    county: '',
    description: '',
    property_type: '',
    year_built: '',
    square_footage: '',
    parking: '',
    amenities: [] as string[],
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    is_active: true,
    is_featured: false
  });

  const [newAmenity, setNewAmenity] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + imageFiles.length > 200) {
      setError('Maximum 200 images allowed per location');
      return;
    }

    setError(null);
    setCompressing(true);
    setCompressionProgress({ current: 0, total: files.length });

    try {
      const compressedFiles: File[] = [];
      const newPreviews: string[] = [];

      // Compression options
      const options = {
        maxSizeMB: 2, // Maximum 2MB per image after compression
        maxWidthOrHeight: 2000, // Max dimension 2000px
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
      };

      // Compress each image
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCompressionProgress({ current: i + 1, total: files.length });

        try {
          // Compress the image
          const compressedFile = await imageCompression(file, options);

          // Rename to preserve original name but with .jpg extension
          const newFile = new File(
            [compressedFile],
            file.name.replace(/\.[^.]+$/, '.jpg'),
            { type: 'image/jpeg' }
          );

          compressedFiles.push(newFile);

          // Create preview
          const preview = await imageCompression.getDataUrlFromFile(newFile);
          newPreviews.push(preview);
        } catch (compressionError) {
          console.error('Error compressing image:', file.name, compressionError);
          // If compression fails, use original file
          compressedFiles.push(file);
          const reader = new FileReader();
          const preview = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          newPreviews.push(preview);
        }
      }

      setImageFiles(prev => [...prev, ...compressedFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);

    } catch (error) {
      console.error('Error processing images:', error);
      setError('Failed to process images. Please try again.');
    } finally {
      setCompressing(false);
      setCompressionProgress({ current: 0, total: 0 });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

    if (isNaN(dragIndex) || dragIndex === dropIndex) return;

    // Reorder images
    const newImageFiles = [...imageFiles];
    const newImagePreviews = [...imagePreviews];

    const draggedFile = newImageFiles[dragIndex];
    const draggedPreview = newImagePreviews[dragIndex];

    newImageFiles.splice(dragIndex, 1);
    newImagePreviews.splice(dragIndex, 1);

    newImageFiles.splice(dropIndex, 0, draggedFile);
    newImagePreviews.splice(dropIndex, 0, draggedPreview);

    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  // Upload images in batches to avoid payload size limits
  const uploadImagesInBatches = async (files: File[], locationName: string): Promise<string[]> => {
    const BATCH_SIZE = 10; // Upload 10 images at a time
    const allImageUrls: string[] = [];
    const totalBatches = Math.ceil(files.length / BATCH_SIZE);

    setUploadProgress({ current: 0, total: files.length, uploading: true });

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const batchFormData = new FormData();
      batchFormData.append('locationName', locationName);

      batch.forEach((file) => {
        batchFormData.append('images', file);
      });

      const response = await fetch('/api/admin/upload-images', {
        method: 'POST',
        body: batchFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to upload batch ${Math.floor(i / BATCH_SIZE) + 1}`);
      }

      const { imageUrls } = await response.json();
      allImageUrls.push(...imageUrls);

      setUploadProgress({ current: i + batch.length, total: files.length, uploading: true });
    }

    setUploadProgress({ current: files.length, total: files.length, uploading: false });
    return allImageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Upload images in batches if there are any
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        if (!formData.name.trim()) {
          throw new Error('Please enter a location name before uploading images');
        }
        imageUrls = await uploadImagesInBatches(imageFiles, formData.name);
      }

      // Step 2: Create location with image URLs (not files)
      const submitData = new FormData();

      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'amenities') {
          submitData.append(key, JSON.stringify(value));
        } else if (key === 'year_built' || key === 'square_footage') {
          if (value) submitData.append(key, value.toString());
        } else {
          submitData.append(key, value.toString());
        }
      });

      // Add image URLs as JSON instead of files
      submitData.append('imageUrls', JSON.stringify(imageUrls));

      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create location';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += ` (${errorData.details})`;
          }
        } catch (parseError) {
          const responseText = await response.text();
          console.error('Non-JSON error response:', responseText);
          errorMessage = `Server error (${response.status}): Unable to parse response.`;
        }
        throw new Error(errorMessage);
      }

      // Redirect to locations list
      router.push(`/admin/locations`);
    } catch (err) {
      console.error('Error creating location:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setUploadProgress({ current: 0, total: 0, uploading: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/locations"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Locations
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-semibold text-black mb-6">Add New Location</h1>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                    placeholder="e.g., Historic Red Barn Estate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                    placeholder="Detailed description of the location..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="property_type"
                    required
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                  >
                    <option value="">Select type...</option>
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 pt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-[#C41E3A] focus:ring-[#C41E3A]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active (visible to public)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-[#C41E3A] focus:ring-[#C41E3A]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Featured (show on home page)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                      placeholder="Nashville"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      County *
                    </label>
                    <select
                      name="county"
                      required
                      value={formData.county}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                    >
                      <option value="">Select county...</option>
                      {TN_COUNTIES.map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Property Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    name="year_built"
                    value={formData.year_built}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                    placeholder="1920"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    name="square_footage"
                    value={formData.square_footage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parking
                  </label>
                  <input
                    type="text"
                    name="parking"
                    value={formData.parking}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                    placeholder="Street parking - 20 vehicles"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Features</h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                  placeholder="e.g., Natural Light, High Ceilings..."
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Contact Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    required
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contact_email"
                      required
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="contact_phone"
                      required
                      value={formData.contact_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                      placeholder="(615) 555-0123"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Images</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (Max 200)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  disabled={compressing}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#C41E3A] file:text-white
                    hover:file:bg-[#a01729]
                    cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {compressing && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#C41E3A] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(compressionProgress.current / compressionProgress.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {compressionProgress.current}/{compressionProgress.total}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Compressing images for faster upload...
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-1">
                  {imageFiles.length} image(s) selected • Images are automatically compressed
                </p>
                {imagePreviews.length > 0 && (
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    Tip: Drag and drop images to reorder. First image will be the featured hero image.
                  </p>
                )}
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="relative cursor-move border-2 border-transparent hover:border-blue-400 rounded transition-colors"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-[#C41E3A] text-white px-2 py-1 rounded text-xs font-bold">
                          FEATURED
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress.uploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="font-medium text-blue-800">
                    Uploading images... {uploadProgress.current} of {uploadProgress.total}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || compressing || uploadProgress.uploading}
                className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {compressing ? 'Compressing Images...' : uploadProgress.uploading ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` : loading ? 'Creating...' : 'Create Location'}
              </button>
              <Link
                href="/admin/locations"
                className="bg-gray-200 text-black px-8 py-3 rounded hover:bg-gray-300 transition-colors font-bold uppercase"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
