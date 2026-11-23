import { useEffect } from 'react';

const BASE = 'DNA Screen Printing';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `DNA — Screen printed in Kitchener since 1994`;
  }, [title]);
}
