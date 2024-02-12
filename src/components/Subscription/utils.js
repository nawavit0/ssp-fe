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
console.log(example1) // true

example2 = validateEmail("")
console.log(example2) // false

example3 = validateEmail("abcd")
console.log(example3) // false
*/

export const validateEmail = email => {
  if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    return false;
  }
  return true;
};
