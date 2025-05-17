export default function ContactPage() {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-16 font-sans">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-gray-300 mb-8 text-center">
            Got questions, feedback, or want to collaborate? Drop us a message!
          </p>
  
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-yellow-400 text-black px-6 py-3 font-bold rounded-lg hover:bg-yellow-500 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    );
  }
  