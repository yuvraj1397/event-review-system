const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

let reviews = [];

app.post('/api/events/:eventId/reviews', (req, res) => {
    const { eventId } = req.params;
    const { registrationExperience, eventExperience, breakfastExperience, overallRating, comment } = req.body;
  
    const review = {
        id: reviews.length + 1,
        eventId,
        registrationExperience,
        eventExperience,
        breakfastExperience,
        overallRating,
        comment,
        likes: 0,
        reports: 0,
        flagged: false,
        organizerResponse: ''
    };
    reviews.push(review);
  
    res.status(201).json({ message: 'Review submitted successfully', reviewId: review.id });
});

app.post('/api/reviews/:reviewId/like', (req, res) => {
    const { reviewId } = req.params;
  
    const review = reviews.find(review => review.id === parseInt(reviewId));
    if (!review) return res.status(404).json({ message: 'Review not found' });
  
    review.likes++;
    res.json({ message: 'Review liked successfully', likes: review.likes });
});

app.post('/api/reviews/:reviewId/report', (req, res) => {
    const { reviewId } = req.params;
  
    const review = reviews.find(review => review.id === parseInt(reviewId));
    if (!review) return res.status(404).json({ message: 'Review not found' });
  
    review.reports++;
    if (review.reports > 5) {
        review.flagged = true;
    }
  
    res.json({ message: 'Review reported successfully', reports: review.reports });
});

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
