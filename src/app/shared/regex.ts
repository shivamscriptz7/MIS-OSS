export const Regex = {
    spaceValidations: new RegExp(/^[a-zA-Z0-9-_](\s?[a-zA-Z0-9-_]){0,50}$/),
    jobValidations: new RegExp(/^[a-zA-Z0-9-_](\s?[a-zA-Z0-9-_]){0,30}$/),//use for job name
    userSpaceValidations: new RegExp(/^[a-zA-Z0-9](\s?[a-zA-Z0-9]){0,50}$/),
    descSpaceValidations: new RegExp(/^[a-zA-Z0-9-_](\s?[a-zA-Z0-9-_]){0,100}$/), //use for monitoring
    descValidation: new RegExp(/^(?!\s)((?!\s{2}).)*$/),
    emailDomianRegex: new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(echelonedge.com)$/)
}