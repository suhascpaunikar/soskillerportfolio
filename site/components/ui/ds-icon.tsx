/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Icons from the Diffusion Studio editor (https://github.com/diffusionstudio/editor,
 * apps/web/src/assets/icons), drawn on a 25×25 grid so 1px strokes stay sharp.
 * The SVG paths are unchanged; only the wrapper is React.
 */

import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

const PATHS = {
  play: <path d="M8.5 7.5V17.5L18.5 12.5L8.5 7.5Z" stroke="currentColor" strokeLinejoin="round" />,
  /** The play triangle, filled: for the main transport button. */
  "play-solid": <path d="M8.5 7.5V17.5L18.5 12.5L8.5 7.5Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" />,
  pause: <path d="M10.5 7.5V17.5M14.5 7.5V17.5" stroke="currentColor" strokeLinecap="round" />,
  "go-to-start": (
    <path d="M6.5 7.5V17.5M13.5 7.5V17.5L8.5 12.5L13.5 7.5ZM18.5 7.5V17.5L13.5 12.5L18.5 7.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "go-to-end": (
    <path d="M18.5 7.5V17.5M11.5 7.5V17.5L16.5 12.5L11.5 7.5ZM6.5 7.5V17.5L11.5 12.5L6.5 7.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "eye-on": (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5002 15.538C10.1591 15.538 8.1859 14.3418 6.9417 12.5C8.1859 10.6582 10.1591 9.462 12.5002 9.462C14.8413 9.462 16.8146 10.6582 18.0587 12.5C16.8146 14.3417 14.8413 15.538 12.5002 15.538ZM12.5002 8.594C9.7295 8.594 7.428 10.0751 6.0562 12.27C5.9682 12.4107 5.9682 12.5893 6.0562 12.73C7.428 14.9248 9.7295 16.406 12.5002 16.406C15.271 16.406 17.5725 14.9248 18.9443 12.73C19.0322 12.5893 19.0322 12.4107 18.9443 12.27C17.5725 10.0751 15.271 8.594 12.5002 8.594ZM12.5002 14.236C13.459 14.236 14.2362 13.4588 14.2362 12.5C14.2362 11.5412 13.459 10.764 12.5002 10.764C11.5415 10.764 10.7642 11.5412 10.7642 12.5C10.7642 13.4588 11.5415 14.236 12.5002 14.236Z"
      fill="currentColor"
    />
  ),
  "eye-off": (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.8062 11.3934C19.0095 11.5205 19.0713 11.7882 18.9442 11.9915C18.5631 12.6012 18.1103 13.1559 17.5956 13.639L18.638 14.6815C18.8075 14.851 18.8075 15.1258 18.638 15.2953C18.4685 15.4647 18.1937 15.4647 18.0243 15.2953L16.928 14.199C16.237 14.7151 15.4592 15.1138 14.6127 15.3646L15.0027 16.8199C15.0647 17.0514 14.9272 17.2893 14.6958 17.3514C14.4642 17.4135 14.2263 17.2761 14.1642 17.0446L13.7668 15.5612C13.3573 15.631 12.9345 15.6674 12.5002 15.6674C12.0659 15.6674 11.6431 15.631 11.2337 15.5612L10.8363 17.0445C10.7742 17.2761 10.5363 17.4135 10.3048 17.3514C10.0732 17.2894 9.9358 17.0514 9.9978 16.8199L10.3877 15.3646C9.5413 15.1138 8.7635 14.7151 8.0725 14.199L6.9762 15.2953C6.8067 15.4647 6.5319 15.4647 6.3624 15.2953C6.1929 15.1258 6.1929 14.851 6.3624 14.6815L7.4049 13.639C6.8902 13.1559 6.4374 12.6012 6.0563 11.9915C5.9292 11.7882 5.991 11.5205 6.1943 11.3934C6.3975 11.2664 6.6653 11.3282 6.7923 11.5314C7.2085 12.1973 7.7167 12.7862 8.3011 13.2742C8.3105 13.2813 8.3197 13.2889 8.3286 13.297C9.47 14.2399 10.8991 14.7994 12.5002 14.7994C14.9374 14.7994 16.976 13.503 18.2082 11.5314C18.3352 11.3282 18.603 11.2664 18.8062 11.3934Z"
      fill="currentColor"
    />
  ),
  copy: (
    <>
      <path d="M9.5 15.5H6A0.5 0.5 0 0 1 5.5 15V6A0.5 0.5 0 0 1 6 5.5H15A0.5 0.5 0 0 1 15.5 6V9.5" stroke="currentColor" />
      <rect x="9.5" y="9.5" width="10" height="10" rx="0.5" stroke="currentColor" />
    </>
  ),
  "external-link": (
    <path
      d="M10.5 7.5H8.5A1 1 0 0 0 7.5 8.5V16.5A1 1 0 0 0 8.5 17.5H16.5A1 1 0 0 0 17.5 16.5V14.5M14.5 7.5H17.5V10.5M17.5 7.5L12.5 12.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  email: (
    <>
      <rect x="6.5" y="7.5" width="12" height="10" rx="1.5" stroke="currentColor" />
      <path d="M6.5 10L12.5 13L18.5 10" stroke="currentColor" strokeLinejoin="round" />
    </>
  ),
  "arrow-right": (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.1465 8.1464C13.3417 7.9512 13.6583 7.9512 13.8535 8.1464L17.8536 12.1465C18.0488 12.3417 18.0488 12.6583 17.8536 12.8536L13.8535 16.8536C13.6583 17.0488 13.3417 17.0488 13.1465 16.8536C12.9512 16.6583 12.9512 16.3417 13.1465 16.1464L16.2929 13H7.5C7.2239 13 7 12.7761 7 12.5C7 12.2239 7.2239 12 7.5 12H16.2929L13.1465 8.8536C12.9512 8.6583 12.9512 8.3417 13.1465 8.1464Z"
      fill="currentColor"
    />
  ),
  minus: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.25 12.5C7.25 12.2239 7.4739 12 7.75 12H17.25C17.5261 12 17.75 12.2239 17.75 12.5C17.75 12.7761 17.5261 13 17.25 13H7.75C7.4739 13 7.25 12.7761 7.25 12.5Z"
      fill="currentColor"
    />
  ),
  plus: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 7.75C13 7.4739 12.7761 7.25 12.5 7.25C12.2239 7.25 12 7.4739 12 7.75V12H7.75C7.4739 12 7.25 12.2239 7.25 12.5C7.25 12.7761 7.4739 13 7.75 13H12V17.25C12 17.5261 12.2239 17.75 12.5 17.75C12.7761 17.75 13 17.5261 13 17.25V13H17.25C17.5261 13 17.75 12.7761 17.75 12.5C17.75 12.2239 17.5261 12 17.25 12H13V7.75Z"
      fill="currentColor"
    />
  ),
} as const;

export type IconName = keyof typeof PATHS;

/** A Diffusion Studio icon, 25px by default; it follows the text colour. */
export function Icon({ name, className, ...rest }: { name: IconName } & Omit<SVGProps<SVGSVGElement>, "children">) {
  return (
    <svg viewBox="0 0 25 25" fill="none" aria-hidden="true" className={cn("size-[25px] shrink-0", className)} {...rest}>
      {PATHS[name]}
    </svg>
  );
}
