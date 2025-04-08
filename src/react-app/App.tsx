import React, { useState } from 'react';
import { Globe2, Music2, Copy, RefreshCw, Star, Users, Zap, Mail } from 'lucide-react';

function App() {
  const [keywords, setKeywords] = useState('');
  const [names, setNames] = useState<Array<{name: string, lang: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'CN', name: '中文' },
    { code: 'JP', name: '日本語' },
    { code: 'KR', name: '한국어' },
    { code: 'ES', name: 'Español' }
  ];

  const generateNames = async () => {
    if (!keywords.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-names`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords,
          language: selectedLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate names');
      }

      const data = await response.json();
      setNames(data.names);
    } catch (err) {
      setError('Failed to generate names. Please try again.');
      console.error('Error generating names:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Music2 className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">BandNameGenerator</span>
          </div>
          <div className="flex items-center space-x-4">
            <Globe2 className="h-5 w-5 text-gray-500" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-sm text-gray-600 border-none bg-transparent focus:ring-0"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Generate Your Perfect</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Band Name</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Create unique band names in your chosen language instantly. Used by thousands of musicians worldwide.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder={`Enter keywords in ${languages.find(l => l.code === selectedLanguage)?.name}`}
                      className="w-full px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={generateNames}
                      disabled={loading || !keywords.trim()}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <RefreshCw className="animate-spin h-5 w-5" />
                      ) : (
                        'Generate Names'
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="mt-3 text-red-600">{error}</p>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {names.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Generated Names in {languages.find(l => l.code === selectedLanguage)?.name}</h2>
            <div className="mt-6 grid gap-4">
              {names.map((name, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{name.name}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(name.name)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Our Generator?</h2>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Globe2 className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Multilingual Support</h3>
                  <p className="mt-2 text-base text-gray-500">Generate names in English, Chinese, Japanese, Korean, and Spanish.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Instant Generation</h3>
                  <p className="mt-2 text-base text-gray-500">Get creative band name suggestions in seconds.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Used by Thousands</h3>
                  <p className="mt-2 text-base text-gray-500">Join thousands of musicians who trust our generator.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">What Musicians Say</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-gray-600">"Found our band name in minutes. The language-specific generation helped us create a unique identity that resonates with our target audience."</p>
              <p className="mt-4 font-medium">- John D., Guitarist</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-gray-600">"As a K-pop band, we needed a name that works well in Korean. This tool gave us exactly what we were looking for!"</p>
              <p className="mt-4 font-medium">- Min-ji K., Vocalist</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-gray-600">"The Spanish name generator helped us create a perfect name for our Latin rock band. Gracias!"</p>
              <p className="mt-4 font-medium">- Carlos R., Drummer</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Is it really free?</h3>
                <p className="mt-2 text-base text-gray-500">Yes! Our basic name generation service is completely free to use.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">How does the language selection work?</h3>
                <p className="mt-2 text-base text-gray-500">Simply choose your desired language from the dropdown menu, enter your keywords, and we'll generate names specifically in that language.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Can I use the generated names commercially?</h3>
                <p className="mt-2 text-base text-gray-500">Yes, all generated names are free to use for any purpose, including commercial use.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
              <div className="mt-4 flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
                <a href="mailto:tangjei@gmail.com" className="ml-2 text-base text-gray-500 hover:text-gray-900">
                  tangjei@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              © 2024 BandNameGenerator. All rights reserved. Created by tangjei.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;