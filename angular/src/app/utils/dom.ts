export function getChildrenHeightSum(parentElement: HTMLElement) {
  let totalHeight = 0;

  Array.from(parentElement.children).forEach((child) => {
    const computedStyle = getComputedStyle(child);
    const marginTop = parseFloat(computedStyle.marginTop) || 0;
    const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
    totalHeight += child.clientHeight + marginTop + marginBottom;
  });

  return totalHeight;
}

export function getChildrenWidthSum(parentElement: HTMLElement) {
  let totalWidth = 0;

  Array.from(parentElement.children).forEach((child) => {
    const computedStyle = window.getComputedStyle(child);
    const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
    const marginRight = parseFloat(computedStyle.marginRight) || 0;
    totalWidth += child.clientWidth + marginLeft + marginRight;
  });

  return totalWidth;
}
