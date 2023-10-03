const User = require('../models/user')


module.exports.home = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect('/login')
    }
    const employees = await User.find({ userType: 'employee' });
    const user = req.user
    console.log(user, "8");
    return res.render('home', {
      title: 'Home',
      showHeader: true,
      showFooter: true,
      employees: employees,
      user
    });


  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports.getEditEmployee = async function (req, res) {
  try {
    const user = req.user
    const userId = req.params.id;
    const employee = await User.findById(userId);
    console.log(employee, "25");
    return res.render('edit-employee', {
      title: 'Edit Employee',
      showHeader: true,
      showFooter: true,
      employee: employee,
      user
    });
  } catch (err) {
    // console.error(err);
    // res.status(500).send('Internal Server Error');
  }
}

module.exports.updateEmployee = async function (req, res) {
  try {
    const userId = req.params.id;
    const requestBody = req.body;
    const updateUser = await User.findByIdAndUpdate(userId, requestBody)

    if (!updateUser) {
      req.flash('error', "User not found!")
      return res.redirect('back')
    }

    req.flash('success', "User updated successfully !")
    return res.redirect('/')

  } catch (error) {

  }
}

module.exports.deleteEmployee = async function (req, res) {
  try {
    const userId = req.params.id

    const findUser = await User.findByIdAndDelete(userId)
    if (!findUser) {
      req.flash('error', "Employee not found !")
      return res.redirect('back')
    }

    req.flash('success', "Employee deleted successfully !")
    return res.redirect('back')

  } catch (error) {
    req.flash('error', error)
    return res.redirect('back')
  }
}