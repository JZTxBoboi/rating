export default function LoadingButton({ loading, children, loadingText = 'Saving...', ...props }) {
  return (
    <button type="button" className="primary-button" disabled={loading || props.disabled} {...props}>
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
