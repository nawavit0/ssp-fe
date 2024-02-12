/* validateEmail

## SUMMARY ##

Check the validity of a input email.

## DESCRIPTION ##

The validateEmail function checks the validity of a input email and
returns a translate string if the input is an invalid email.

## PARAMETER ##

@param {string}  |  email  |  Email for validation

## EXAMPLE ##

example1 = validateEmail("tanawit@central.tech")
console.log(example1) // null

example2 = validateEmail("")
console.log(example2) // "register.form.required"

example3 = validateEmail("abcd")
console.log(example3) // "register.form.email_format"
*/

export const validateEmail = email => {
  let error = null;
  if (!email) {
    error = 'register.form.required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    error = 'register.form.email_format';
  } else if (email.length < 5 && email.length > 30) {
    error = 'register.form.email_format';
  }
  return error;
};

/* validateFirstName

## SUMMARY ##

Check the validity of a input firstName.

## DESCRIPTION ##

The validateFirstName function checks the validity of a input first name and
returns a translate string if the input is an invalid first name.

## PARAMETER ##

@param {string}  |  firstName  |  first name for validation

## EXAMPLE ##

example1 = validateFirstName("Tanawit")
console.log(example1) // null

example2 = validateFirstName("")
console.log(example2) // "login.validation.required_field"
*/

export const validateFirstName = firstName => {
  let error = null;
  if (!firstName) {
    error = 'register.form.required';
  }
  return error;
};

/* validateLastName

## SUMMARY ##

Check the validity of a input last name.

## DESCRIPTION ##

The validateLastName function checks the validity of a input last name and
returns a translate string if the input is an invalid last name.

## PARAMETER ##

@param {string}  |  last name  |  last name for validation

## EXAMPLE ##

example1 = validateLastName("Pattanaveerangkoon")
console.log(example1) // null

example2 = validateLastName("")
console.log(example2) // "login.validation.required_field"
*/

export const validateLastName = lastName => {
  let error = null;
  if (!lastName) {
    error = 'register.form.required';
  }
  return error;
};

/* validatePassword

## SUMMARY ##

Check the validity of a input password.

## DESCRIPTION ##

The validatePassword function checks the validity of a input password and
returns a translate string if the input is an invalid password.

## PARAMETER ##

@param {string}  |  password  |  Password for validation

## EXAMPLE ##

example1 = validatePassword("abcd")
console.log(example1) // null

example2 = validatePassword("")
console.log(example2) // "register.form.required"
*/

export const validatePassword = password => {
  let error = null;
  if (!password) {
    error = 'register.form.required';
  } else if (
    password === password.toLowerCase() ||
    password === password.toUpperCase() ||
    password === password.replace(/\D/g, '') ||
    !/\d/.test(password)
  ) {
    error = 'register.form.password_format';
  }
  return error;
};
