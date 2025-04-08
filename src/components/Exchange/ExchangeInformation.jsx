import PropTypes from 'prop-types'


const ExchangeInformation = () => {
  return (
    <div>ExchangeInformation</div>
  )
}

export default ExchangeInformation

ExchangeInformation.propTypes = {
  firstCurrentStage: PropTypes.object.isRequired,
  exchangeData: PropTypes.object.isRequired,
  handleExchangeDataChange: PropTypes.func.isRequired,
  handleExchangeDataSubmit: PropTypes.func.isRequired,
  handleExchangeDataReset: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
  showSuccessMessage: PropTypes.bool.isRequired,
  showErrorMessage: PropTypes.bool.isRequired,
}