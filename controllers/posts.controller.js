const express = require('express')
const router = express.Router()
const Post = require('../models/post') 
const isSignedIn = require('../middleware/is-signed-in')

// new post page
router.get('/new', isSignedIn, (req, res) => {
    res.render('posts/new.ejs')
})

//index page
router.get('/', async (req, res) => {
    const foundPost = await Post.find().populate('poster')
    res.render('posts/index.ejs', {foundPost: foundPost})
})

router.get('/my-posts/',isSignedIn, async (req,res) => {
    let foundPost = await Post.find({poster: req.session.user._id}).populate('poster')
    res.render('posts/my-posts.ejs', {foundPost: foundPost})
    console.log(foundPost)
});

router.get('/:postId/', isSignedIn ,async (req, res) => {
    const foundPost = await Post.findById(req.params.postId).populate('poster').populate('comments.author')
    res.render('posts/show.ejs', {foundPost: foundPost})
})

router.post('/' , isSignedIn , async (req, res) => {
    try { 
        req.body.poster = req.session.user._id
        await Post.create(req.body)
        res.redirect('/posts')
        
    } catch (error) {
    console.log(error)
    res.send('something went wrong')
    } 
})

router.get('/:postId/edit', isSignedIn, async (req,res) => {
    const foundPost = await Post.findById(req.params.postId).populate('poster')
    if (foundPost.poster._id.equals(req.session.user._id)) {
        return res.render('posts/edit.ejs', {foundPost: foundPost})
    }
        return res.send('Not authorized')
})

router.put('/:postId', async (req,res) => {
    const foundPost = await Post.findById(req.params.postId).populate('poster')
    if (foundPost.poster._id.equals(req.session.user._id)) {
    await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true })
    res.redirect(`/posts/${req.params.postId}`)
    }
    return res.send('Not authorized')
})

router.post('/:postId/comments', async (req,res) => {
    const foundPost = await Post.findById(req.params.postId)
    req.body.author = req.session.user._id
    foundPost.comments.push(req.body)
    await foundPost.save()
    res.redirect(`/posts/${req.params.postId}`)

})

router.delete('/:postId', async (req,res) => {
    const foundPost = await Post.findById(req.params.postId).populate('poster')
    if (foundPost.poster._id.equals(req.session.user._id)) {
        await foundPost.deleteOne()
        return res.redirect('/posts')
    }
})

module.exports = router