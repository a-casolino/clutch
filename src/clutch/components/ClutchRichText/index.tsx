
const RichText = ({ children, tag = 'span', ...props }) => {
  const CustomTag = tag;
  
  if (typeof children === 'string') {
    return <CustomTag dangerouslySetInnerHTML={{ __html: children }} {...props} />;
  }

  return <CustomTag {...props}>{children}</CustomTag>;
}

export default RichText;
