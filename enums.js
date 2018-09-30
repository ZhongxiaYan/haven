const ErrorStatus = {
  ALREADY_EXISTS: 'alreadyExists',
  SAVE_FAILED: 'saveFailed',
  DOES_NOT_EXIST: 'doesNotExist'
}

const RequestStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};  

const ApplicationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CANCELLED: 'cancelled'
};  

module.exports = { ErrorStatus, RequestStatus, ApplicationStatus };
