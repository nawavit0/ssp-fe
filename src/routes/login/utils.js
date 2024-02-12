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
console.log(example2) // "login.validation.required_field"

example3 = validateEmail("abcd")
console.log(example3) // "login.validation.invalid_email_format"
*/

export const validateEmail = email => {
  let error = null;
  if (!email) {
    error = 'login.validation.required_field';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    error = 'login.validation.invalid_email_format';
  } else if (email.length < 5 && email.length > 30) {
    error = 'login.validation.invalid_email_format';
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
console.log(example2) // "login.validation.required_field"
*/

export const validatePassword = password => {
  let error = null;
  if (!password) {
    error = 'login.validation.required_field';
  }
  return error;
};
