'use client';

import React, { forwardRef, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

const ParamsLink = ({
  href = '',
  replaceParams,
  toggleParams,
  params,
  children,
}) => {
  const searchParams = useSearchParams();

  const calculatedHref = useMemo(() => {
    const resultSearchParams = replaceParams ? new URLSearchParams() : new URLSearchParams(searchParams);

    // Merge search parameters from queryEntries into hrefSearchParams
    params.forEach(({name, value}) => {
      if (toggleParams) {
        if (!value || resultSearchParams.has(name, value)) {
          resultSearchParams.delete(name);
        } else {
          resultSearchParams.set(name, value);
        }
      } else if (!resultSearchParams.has(name, value) && value !== undefined && value !== null) {
        resultSearchParams.append(name, value);
      }
    });

    const finalSearchParams = resultSearchParams.toString();

    return `${href}?${finalSearchParams || ''}`;
  }, [href, searchParams, replaceParams, toggleParams, params]);

  return children({ calculatedHref });
};

function ClutchLink({
  className,
  children,
  disabled,
  download,
  href = '',
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  download?: boolean;
  href: string | { url: string; params?: Record<string, string>[]; toggleParams?: boolean; replaceParams?: boolean };
  [key: string]: any;
}, ref) {
  const isUsingLinkDirectly = typeof href === 'string';
  let safeHref = isUsingLinkDirectly ? href : '';
  let replaceParams = false;
  let toggleParams = false;
  let params = [];

  if (!isUsingLinkDirectly && typeof href === 'object') {
    replaceParams = href.replaceParams;
    toggleParams = href.toggleParams;
    params = href.params;
    safeHref = href.url;
  }

  const currentPathname = usePathname();

  const onClick = useCallback(
    (event) => {
      if (disabled) {
        event.preventDefault();
      }
    },
    [disabled],
  );


  const ariaAttributes: Record<string, any> = useMemo(() => {
    const ariaAttributes = {};

    const isActive = currentPathname === (safeHref || currentPathname).split('?')[0];

    if (isActive) {
      ariaAttributes['aria-current'] = 'page';
    }

    if (disabled) {
      ariaAttributes['aria-disabled'] = true;
    }
    
    return ariaAttributes;
  }, [currentPathname, safeHref, disabled]);

  if (download) {
    return (
      <a
        {...ariaAttributes}
        ref={ref}
        className={className}
        href={disabled ? undefined : safeHref}
        role={disabled ? 'link' : undefined}
        onClick={onClick}
        download
        {...props}
      >
        {children}
      </a>
    );
  }

  if (disabled) {
    return (
      <a
        {...ariaAttributes}
        role="link"
        ref={ref}
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (isUsingLinkDirectly) {
    return (
      <Link
        {...ariaAttributes}
        ref={ref}
        href={safeHref}
        className={className}
        onClick={onClick}
        download={download}
        {...props}
        prefetch={props.prefetch ?? false}
      >
        {children}
      </Link>
    );
  }

  return (
    <Suspense>
      <ParamsLink
        replaceParams={replaceParams}
        toggleParams={toggleParams}
        params={params}
        href={safeHref}
      >
        {({ calculatedHref }) => (
          <Link
            {...ariaAttributes}
            ref={ref}
            className={className}
            onClick={onClick}
            href={calculatedHref}
            {...props}
            prefetch={props.prefetch ?? false}
          >
            {children}
          </Link>
        )}
      </ParamsLink>
    </Suspense>
  );
}
  
export default forwardRef(ClutchLink);
