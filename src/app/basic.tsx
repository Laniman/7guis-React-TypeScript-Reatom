import React from 'react'
import styled from 'react-emotion'
import {css} from 'emotion'
import {
  alignItems,
  alignSelf,
  background,
  borderRadius,
  borders,
  bottom,
  boxShadow,
  color,
  flex,
  flexDirection,
  flexWrap,
  fontSize,
  fontWeight,
  height,
  justifyContent,
  left,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  position,
  right,
  space,
  textAlign,
  top,
  util,
  width,
  zIndex,
} from 'styled-system'
import tag from 'clean-tag'
import { cx } from './utils';
import styles from './basic.module.css';

const vspace = props => {
  let v = props.vspace
  const theme = util.fallbackTheme(props)
  if (v == null) return undefined
  if (theme && theme.space && theme.space[v]) {
    v = util.px(theme.space[v])
  }
  return css`
    &>* {
      margin-top: ${v};
    }
    &>*:first-child {
      margin-top: 0;
    }
  `
}

const hspace = props => {
  let v = props.hspace
  const theme = util.fallbackTheme(props)
  if (v == null) return undefined
  if (theme && theme.space && theme.space[v]) {
    v = util.px(theme.space[v])
  }
  return css`
    &>* {
      margin-left: ${v};
    }
    &>*:first-child {
      margin-left: 0;
    }
  `
}

// TODO: Is there an easy way to say 'apply all of the styles to this styled-component'?
export const Box = styled(tag)`
${vspace} ${hspace}
${space}
${width} ${height}
${minWidth} ${maxWidth} ${minHeight} ${maxHeight}
${fontSize}
${fontWeight}
${color}
${flex}
${textAlign}
${background}
${borders} ${borderRadius}
${boxShadow}
${position} ${zIndex} ${left} ${top} ${right} ${bottom}
` as any

export const Flex = styled(Box)`
display: flex;
${alignItems}
${justifyContent}
${flexWrap}
${flexDirection}
${alignSelf}
` as any

export const Flex2 = ({ className, ...rest }: React.ComponentPropsWithoutRef<'div'>) => {
  return <div className={cx('flex', className)} {...rest} />
}

export const VFlex = styled(Flex)`
` as any
VFlex.defaultProps = {
  flexDirection: 'column'
}

export const BoxClickable = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<'div'>>(
  ({ className, ...rest }, ref) => {
    return <div ref={ref} className={cx('inline-block', className)} {...rest} />;
  },
);

export const Span = ({ className, ...rest}: React.ComponentPropsWithoutRef<'span'>) => {
  return <span className={cx('inline-block', className)} {...rest} />
}

export const Stack = (props: React.PropsWithChildren) =>  {
  const [first, ...rest] = React.Children.toArray(props.children)

  if (first == null) return null

  return (
    <div className={styles.stack}>
      {first}
      {rest && <Stack>{rest}</Stack>}
    </div>
  );
}

export const TextInput = ({ className, ...rest}: React.ComponentPropsWithoutRef<'input'>) => {
  return <input type="text" className={cx(styles.input, className)} {...rest} />
}

export const Label = ({ className, ...rest}: React.ComponentPropsWithoutRef<'span'>) => {
  return <Span className={cx(styles.label, className)} {...rest} />
}

export const Button = ({ className, ...rest}: React.ComponentPropsWithoutRef<'button'>) => {
  return <button type="button" className={cx(styles.button, styles.clickable, className)} {...rest} />
}
