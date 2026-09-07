import React from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';

export const mdxComponents = {
  pre: (props: React.HTMLAttributes<HTMLPreElement>) =>
    React.createElement('pre', props),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
};

export interface SerializedMDXResult<TFrontmatter = Record<string, unknown>> {
  content: React.ReactElement;
  frontmatter: TFrontmatter;
}

export async function serializeMDX<TFrontmatter = Record<string, unknown>>(
  content: string
): Promise<SerializedMDXResult<TFrontmatter> | null> {
  try {
    const compiled = await compileMDX<TFrontmatter>({
      source: content,
      components: mdxComponents,
      options: {
        parseFrontmatter: false,
      },
    });

    return compiled;
  } catch (error) {
    console.error('[MDX Serialization] Error compiling MDX content:', error);
    return null;
  }
}
