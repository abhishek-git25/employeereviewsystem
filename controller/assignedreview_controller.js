const User = require('../models/user')
const EmployeeReview = require('../models/employee-review');
const AssignReview = require('../models/assign-review')

module.exports.pendingReviews = async function (req, res) {

    const user = req.user;
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }

    console.log(user , "12");

    const currPendingReviwer = await AssignReview.find({ reviewedBy: user._id })


    const pendingReviewEmployees = currPendingReviwer.map(async (item) => {
        const emp = await User.findById(item.reviewedFor).select('username')
        return {
            username: emp.username,
            status: item.status,
            date: item.createdAt,
            user_id: item.reviewedFor
        };
    })

    const all = await Promise.all(pendingReviewEmployees);
    console.log(all, "26");

    return res.render('assign-review-list', {
        showHeader: true,
        showFooter: true,
        title: 'Pending Reviews',
        employees: all,
        user
    })
}


module.exports.editFeedback = async function (req, res) {
    const reviewedForId = req.params.id
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    const reviewedForData = await AssignReview.find({ reviewedFor: reviewedForId })

    const reviewedForName = await User.findById(reviewedForId)

    const editData = {
        name: reviewedForName,
        otherData: reviewedForData
    }
    console.log(editData, "48");


    return res.render('feedback-employeeview', {
        showFooter: false,
        showHeader: false,
        title: "Edit Feedback",
        editData
    })

}

module.exports.addFeedback = async function (req, res) {
    try {
        const reviewedForId = req.params.id
        const user = req.user;
        const { reviewDate, rating, reviewcomments } = req.body
        const filter = { reviewedFor: reviewedForId }; // Filter criteria
        const update = {
            reviewedFor: reviewedForId,
            reviewedBy: user._id,
            status: 'completed',
        };

        if (!req.isAuthenticated()) {
            return res.redirect('/login')
        }
            const reviewed = new EmployeeReview({
                employeeId: reviewedForId,
                reviewDate: reviewDate,
                rating: rating,
                reviewcomments: reviewcomments
            })

            await reviewed.save()
            await AssignReview.findOneAndUpdate(filter , update)
            req.flash('success', "Feedback aadded")
            return res.redirect('back')

    } catch (error) {
        req.flash('error', error)
        return res.redirect('back')
    }
}