const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

// @route POST /api/items -> Add item
router.post('/', protect, async (req, res) => {
    const { itemName, description, type, location, date, contactInfo } = req.body;
    try {
        const item = await Item.create({
            itemName, description, type, location, date, contactInfo,
            user: req.user._id
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route GET /api/items -> View all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/items/search?name=xyz -> Search items
router.get('/search', async (req, res) => {
    const { name } = req.query;
    try {
        const items = await Item.find({
            itemName: { $regex: name, $options: 'i' }
        }).populate('user', 'name email');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/items/:id -> View item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('user', 'name email');
        if (item) res.json(item);
        else res.status(404).json({ message: 'Item not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/items/:id -> Update item
router.put('/:id', protect, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/items/:id -> Delete item
router.delete('/:id', protect, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
