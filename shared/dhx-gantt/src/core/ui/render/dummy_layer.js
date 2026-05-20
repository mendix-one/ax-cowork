export default function () {
  // eslint-disable-next-line no-console
  console.error('You are trying to use a Pro feature that is not available in the GPL version.')
  return {
    render: function () {},
    isInViewPort: function () {},
    getVisibleRange: function () {},
  }
}
