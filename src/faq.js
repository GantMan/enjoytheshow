// Rendered as the homepage FAQ and as FAQPage structured data
const faq = [
  {
    q: 'Is Enjoying The Show free?',
    a: 'Yes. It is free to use and there is no account or sign-up. Pick a room name and share the link.',
  },
  {
    q: 'Is my webcam video uploaded anywhere?',
    a: 'No. Face detection runs in your own browser with TensorFlow.js. Only one word per detected face, such as "happy", is sent to the room. Video and images never leave your device.',
  },
  {
    q: 'Which emotions can it detect?',
    a: 'Happy, neutral, surprised, sad, fearful, disgusted and angry. The speaker sees a live pie chart of how many faces show each one.',
  },
  {
    q: 'Does it work for virtual talks on Zoom, Google Meet or a livestream?',
    a: 'Yes. Audience members open the room link in a browser tab while they watch. Some computers only let one app use the camera at a time, so a phone or a second device works well too.',
  },
  {
    q: 'What does the audience need?',
    a: 'A modern browser with JavaScript and WebGL, a webcam, and permission to use it. Nothing to install.',
  },
  {
    q: 'Can I run my own copy?',
    a: 'Yes. The source is MIT licensed on GitHub at github.com/GantMan/enjoytheshow, with instructions for deploying your own backend on AWS.',
  },
]

export default faq

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}
