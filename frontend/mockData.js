// Mock event data for development and testing, including images

export const mockEvents = [
  {
    id: 1,
    title: 'Tech Conference 2023',
    date: '2023-10-15',
    description: 'A conference on latest tech trends.',
    location: 'San Francisco, CA',
    attendees: 150,
    image: 'event-img1.jpg'  // Image path for local asset
  },
  {
    id: 2,
    title: 'Music Festival',
    date: '2023-11-20',
    description: 'Outdoor music event with live performances.',
    location: 'Los Angeles, CA',
    attendees: 500,
    image: 'event-img2.jpg'  // Image path for local asset
  },
  {
    id: 3,
    title: 'Workshop: React Native Basics',
    date: '2023-12-05',
    description: 'Hands-on workshop for beginners.',
    location: 'New York, NY',
    attendees: 50,
    image: 'event-img3.jpg'  // Image path for local asset
  },
  {
    id: 4,
    title: 'Startup Pitch Night',
    date: '2023-12-12',
    description: 'Networking event for entrepreneurs.',
    location: 'Austin, TX',
    attendees: 100,
    image: 'event-img4.jpg'  // Image path for local asset
  },
  {
    id: 5,
    title: 'Art Exhibition',
    date: '2023-12-18',
    description: 'Showcasing local artists and their works.',
    location: 'Seattle, WA',
    attendees: 200,
    image: 'event-img5.jpg'  // Image path for local asset
  }
];

// Function to simulate API delay (optional, for realistic testing)
export const fetchMockEvents = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockEvents), 500); // Simulate 500ms delay
  });
};
