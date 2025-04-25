import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateImage } from '../features/images/imageSlice';

const GenerateImage = () => {
  const [prompt, setPrompt] = useState('');
  const dispatch = useDispatch();
  const { generatedImage, isLoading, isError, message } = useSelector((state) => state.images);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await dispatch(generateImage(prompt));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Generate AI Images
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter a description of the image you want to generate
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="sr-only">
                Image Description
              </label>
              <textarea
                id="prompt"
                name="prompt"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </form>

          {isError && (
            <div className="mt-4 text-red-500 text-sm text-center">{message}</div>
          )}

          {generatedImage && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Generated Image
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={generatedImage.url}
                  alt={prompt}
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImage; 