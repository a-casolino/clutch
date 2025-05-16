
import qs from 'qs';
import { parseSearchParams } from '../../../_debug/helpers.ts';
import { serverFunctions } from './functions.ts';

export default async function FnRunner({params, searchParams, ...props})  {
  const parsedSearchParams = parseSearchParams(await searchParams);
  const { source, args = [] } = parsedSearchParams;

  if (!source) {
    return <pre id="fnRunnerResult" data-error>No source provided</pre>;
  }

  const isLocal = source?.type === 'LOCAL';

  let fn;

  if (isLocal) {
    const module = serverFunctions?.[source.moduleId];
    fn = module?.[source.exportName];
  } else {
    const bundle = serverFunctions?.[source.packageName];
    const file = bundle?.[source.path];
    fn = file?.[source.exportName];
  }

  if (typeof fn !== 'function') {
    return <pre id="fnRunnerResult" data-error>Invalid function</pre>;
  }

  // json stringify of the request converts all undefined to nulls, so we need to convert them again
  // otherwise default values will never work
  const cleanArgs = (args || []).map(arg => {
    if (arg === "EMPTY_CLUTCH_VALUE") {
      return undefined;
    }

    return arg;
  });
  
  let result;
  
  try {
    result = await fn(...cleanArgs);

    result = JSON.stringify(result, null, 2);
  } catch (error) {
    return <pre id="fnRunnerResult" data-error>{error.message}</pre>;
  }

  return <pre id="fnRunnerResult">{result}</pre>;
}
