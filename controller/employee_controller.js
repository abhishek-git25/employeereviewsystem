const User = require('../models/user')
const EmployeeReview = require('../models/employee-review');
const AssignReview = require('../models/assign-review')
const bcrypt = require("bcrypt");


module.exports.assignReviewer = async function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/login')
        }
        const user  = req.user
        const employees = await User.find({});
        return res.render('assign-employee-reviewer', {
            showFooter: true,
            showHeader: true,
            title: 'Assign Reviewer',
            employees,
            user
        })

    } catch (error) {
        req.flash("error", error)
        return res.redirect('back')
    }
}



module.exports.addEmployee = async function (req, res) {
    try {
        const { username, email, password, department, position } = req.body;
        const foundUser = await User.findOne({ email })

        if (foundUser) {
            req.flash('error', 'Employee already exists !');
            return res.redirect('back');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, department, position });
        await newUser.save();
        req.flash('success', 'Employee added successfully!');
        return res.redirect('back');

    } catch (error) {
        req.flash('error', 'Internal Server Error');
        return res.redirect('back');
    }
}

module.exports.employeeReview = async function (req, res) {
    try {

        if (!req.isAuthenticated()) {
            return res.redirect('/login')
        }
        const user  = req.user
        const employees = await User.find({ userType: "employee" })
        const reviewedEmployee = await EmployeeReview.find({});

        const allEmployeePromises = reviewedEmployee.map(async (item) => {
            const user = await User.findById(item.employeeId).select('username')
            return {
                employeeId: item._id,
                username: user.username,
                reviewDate: item.reviewDate,
                rating: item.rating,
                reviewcomments: item.reviewcomments,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                __v: item.__v
            }
        })

        const users = await Promise.all(allEmployeePromises)

        return res.render('employee-review', {
            title: "Employee Review",
            employees: employees,
            showHeader: true,
            showFooter: true,
            reviewedEmployee: users,
            user
        })

    } catch (error) {
        req.flash('error', 'Internal server error !')
        return res.redirect('back')
    }
}

module.exports.addEmployeeReview = async function (req, res) {
    try {
        const { employeeId, reviewDate, rating, reviewcomments } = req.body;
        const employee = await EmployeeReview.findOne({ employeeId })

        if (employee) {
            employee.reviewDate = reviewDate,
                employee.rating = rating,
                employee.reviewcomments = reviewcomments
            req.flash('success', "Review updated successfully !")
            await employee.save()
            return res.redirect('back')
        }


        const newReview = new EmployeeReview({
            employeeId,
            reviewDate,
            rating,
            reviewcomments
        });
        req.flash('success', "Review added successfully !")
        await newReview.save()
        return res.redirect('back')


    } catch (error) {
        req.flash('error', "Internal server error !")
        return res.redirect('back')
    }
}


module.exports.assignEmployeeReviewers = async function (req, res) {
    try {
        const { reviewedFor, reviewedBy } = req.body;
        if (!reviewedFor) {
            req.flash('error', "At least one reviewee should be selected !");
            return res.redirect('back')
        }

        if (!reviewedBy || reviewedBy.length < 1) {
            req.flash('error', "At least one reviewer should be selected !");
            return res.redirect('back')
        }
        
        if (reviewedBy == reviewedFor) {
            req.flash('error', "Employee and reviewer cannot be the same !");
            return res.redirect('back')
        }

        const assignment = {
            reviewedFor,
            reviewedBy,
        };

        const newAssignment = new AssignReview(assignment);
        await newAssignment.save();

        req.flash('success', "Reviewer assigned successfully");
        res.redirect('back'); // Redirect to the desired page after successful assignment
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('back'); // Redirect to the desired page in case of an error
    }
}

