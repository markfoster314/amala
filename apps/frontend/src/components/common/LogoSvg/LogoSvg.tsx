import { Svg } from '@markfoster314/marduk';

export interface LogoSvgProps {
  align?: 'left' | 'center' | 'right';
  className?: string;
  animation?: 'heartpulse' | 'none';
  size?: number;
}

export const LogoSvg = ({
  size = 160,
  animation = 'none',
  className,
  align = 'center',
  ...props
}: LogoSvgProps) => {
  return (
    <Svg
      viewBox="0 0 127.5 127.5"
      className={className}
      animation={animation === 'none' ? undefined : animation}
      size={size}
      align={align}
      responsive={true}
      {...props}
    >
      <defs>
        <clipPath id="5155b50983">
          <path
            d="M 47 5 L 80 5 L 80 37 L 47 37 Z M 47 5 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="77a189c511">
          <path
            d="M 63.390625 5.28125 L 79.238281 21.128906 L 63.390625 36.976562 L 47.542969 21.128906 Z M 63.390625 5.28125 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="861ffc5a94">
          <path
            d="M 0.335938 0.257812 L 32.367188 0.257812 L 32.367188 32 L 0.335938 32 Z M 0.335938 0.257812 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="0a502ae665">
          <path
            d="M 16.390625 0.28125 L 32.238281 16.128906 L 16.390625 31.976562 L 0.542969 16.128906 Z M 16.390625 0.28125 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="72acca8259">
          <rect x="0" width="33" y="0" height="32" />
        </clipPath>
        <clipPath id="d4539c0fe0">
          <path
            d="M 47 0 L 80 0 L 80 32 L 47 32 Z M 47 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="bd794d7811">
          <path
            d="M 63.390625 0 L 79.238281 15.847656 L 63.390625 31.695312 L 47.542969 15.847656 Z M 63.390625 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="11d0ad14cf">
          <path
            d="M 0.335938 0 L 32.367188 0 L 32.367188 31.796875 L 0.335938 31.796875 Z M 0.335938 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="6ac7ba8b8a">
          <path
            d="M 16.390625 0 L 32.238281 15.847656 L 16.390625 31.695312 L 0.542969 15.847656 Z M 16.390625 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="3e30aa1de7">
          <rect x="0" width="33" y="0" height="32" />
        </clipPath>
        <clipPath id="79855f5e8a">
          <path
            d="M 95 47 L 127 47 L 127 80 L 95 80 Z M 95 47 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="a5a1bf1ae5">
          <path
            d="M 110.933594 47.542969 L 126.78125 63.390625 L 110.933594 79.238281 L 95.085938 63.390625 Z M 110.933594 47.542969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="49016e1aac">
          <path
            d="M 0 0.335938 L 31.941406 0.335938 L 31.941406 32.367188 L 0 32.367188 Z M 0 0.335938 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="bf074ca11c">
          <path
            d="M 15.933594 0.542969 L 31.78125 16.390625 L 15.933594 32.238281 L 0.0859375 16.390625 Z M 15.933594 0.542969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="7840780ca3">
          <rect x="0" width="32" y="0" height="33" />
        </clipPath>
        <clipPath id="72cfaedf3c">
          <path
            d="M 71 27 L 104 27 L 104 60 L 71 60 Z M 71 27 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b81ef2191e">
          <path
            d="M 87.164062 27.53125 L 103.011719 43.378906 L 87.164062 59.226562 L 71.316406 43.378906 Z M 87.164062 27.53125 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="ad904cea85">
          <path
            d="M 0.242188 0.492188 L 32.035156 0.492188 L 32.035156 32.289062 L 0.242188 32.289062 Z M 0.242188 0.492188 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="a4ea3c3ada">
          <path
            d="M 16.164062 0.53125 L 32.011719 16.378906 L 16.164062 32.226562 L 0.316406 16.378906 Z M 16.164062 0.53125 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b1c2c88a5d">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="e9f77bb432">
          <path
            d="M 71 23 L 104 23 L 104 56 L 71 56 Z M 71 23 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="06fc6dad84">
          <path
            d="M 87.164062 23.773438 L 103.011719 39.621094 L 87.164062 55.46875 L 71.316406 39.621094 Z M 87.164062 23.773438 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="a453a051dc">
          <path
            d="M 0.242188 0.667969 L 32.035156 0.667969 L 32.035156 32.703125 L 0.242188 32.703125 Z M 0.242188 0.667969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="6356c7b1cf">
          <path
            d="M 16.164062 0.773438 L 32.011719 16.621094 L 16.164062 32.46875 L 0.316406 16.621094 Z M 16.164062 0.773438 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="0443993d8d">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="fa988aa41e">
          <path
            d="M 23 27 L 56 27 L 56 60 L 23 60 Z M 23 27 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="f4bd81b161">
          <path
            d="M 39.621094 27.53125 L 55.46875 43.378906 L 39.621094 59.226562 L 23.773438 43.378906 Z M 39.621094 27.53125 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="0dc8f78be8">
          <path
            d="M 0.667969 0.492188 L 32.703125 0.492188 L 32.703125 32.289062 L 0.667969 32.289062 Z M 0.667969 0.492188 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="be6756465c">
          <path
            d="M 16.621094 0.53125 L 32.46875 16.378906 L 16.621094 32.226562 L 0.773438 16.378906 Z M 16.621094 0.53125 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="61c6d8ecc5">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="d5641d46a5">
          <path
            d="M 23 23 L 56 23 L 56 56 L 23 56 Z M 23 23 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="3526a79847">
          <path
            d="M 39.621094 23.773438 L 55.46875 39.621094 L 39.621094 55.46875 L 23.773438 39.621094 Z M 39.621094 23.773438 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="9f6e78aa24">
          <path
            d="M 0.667969 0.667969 L 32.703125 0.667969 L 32.703125 32.703125 L 0.667969 32.703125 Z M 0.667969 0.667969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="505445cfdb">
          <path
            d="M 16.621094 0.773438 L 32.46875 16.621094 L 16.621094 32.46875 L 0.773438 16.621094 Z M 16.621094 0.773438 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="40cd709127">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="1acbea7e79">
          <path
            d="M 0 47 L 32 47 L 32 80 L 0 80 Z M 0 47 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="e14755a91e">
          <path
            d="M 15.847656 47.542969 L 31.695312 63.390625 L 15.847656 79.238281 L 0 63.390625 Z M 15.847656 47.542969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="719d78f8ba">
          <path
            d="M 0 0.335938 L 31.796875 0.335938 L 31.796875 32.367188 L 0 32.367188 Z M 0 0.335938 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="bf06bd712a">
          <path
            d="M 15.847656 0.542969 L 31.695312 16.390625 L 15.847656 32.238281 L 0 16.390625 Z M 15.847656 0.542969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="bb998a6e3d">
          <rect x="0" width="32" y="0" height="33" />
        </clipPath>
        <clipPath id="3c29484c10">
          <path
            d="M 23 71 L 56 71 L 56 104 L 23 104 Z M 23 71 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="c887000932">
          <path
            d="M 39.621094 71.316406 L 55.46875 87.164062 L 39.621094 103.011719 L 23.773438 87.164062 Z M 39.621094 71.316406 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="1b8da7612c">
          <path
            d="M 0.667969 0.242188 L 32.703125 0.242188 L 32.703125 32.035156 L 0.667969 32.035156 Z M 0.667969 0.242188 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="21db3ec568">
          <path
            d="M 16.621094 0.316406 L 32.46875 16.164062 L 16.621094 32.011719 L 0.773438 16.164062 Z M 16.621094 0.316406 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="03b42890a1">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="233331eb39">
          <path
            d="M 47 95 L 80 95 L 80 127 L 47 127 Z M 47 95 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b01d2f4a3a">
          <path
            d="M 63.390625 95.085938 L 79.238281 110.933594 L 63.390625 126.78125 L 47.542969 110.933594 Z M 63.390625 95.085938 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="68bb0fa720">
          <path
            d="M 0.335938 0 L 32.367188 0 L 32.367188 31.941406 L 0.335938 31.941406 Z M 0.335938 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="e9a141cd4b">
          <path
            d="M 16.390625 0.0859375 L 32.238281 15.933594 L 16.390625 31.78125 L 0.542969 15.933594 Z M 16.390625 0.0859375 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="c58a927306">
          <rect x="0" width="33" y="0" height="32" />
        </clipPath>
        <clipPath id="bca5b08979">
          <path
            d="M 71 71 L 104 71 L 104 104 L 71 104 Z M 71 71 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b38f01287a">
          <path
            d="M 87.164062 71.316406 L 103.011719 87.164062 L 87.164062 103.011719 L 71.316406 87.164062 Z M 87.164062 71.316406 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="f952b4f88f">
          <path
            d="M 0.242188 0.242188 L 32.035156 0.242188 L 32.035156 32.035156 L 0.242188 32.035156 Z M 0.242188 0.242188 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="003988a10c">
          <path
            d="M 16.164062 0.316406 L 32.011719 16.164062 L 16.164062 32.011719 L 0.316406 16.164062 Z M 16.164062 0.316406 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b3a53d8bbb">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="140533dd3c">
          <path
            d="M 47 52 L 80 52 L 80 85 L 47 85 Z M 47 52 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="90a2792241">
          <path
            d="M 63.390625 52.824219 L 79.238281 68.671875 L 63.390625 84.519531 L 47.542969 68.671875 Z M 63.390625 52.824219 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="8b86bc1f42">
          <path
            d="M 0.335938 0.59375 L 32.367188 0.59375 L 32.367188 32.628906 L 0.335938 32.628906 Z M 0.335938 0.59375 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="f10ad16fb6">
          <path
            d="M 16.390625 0.824219 L 32.238281 16.671875 L 16.390625 32.519531 L 0.542969 16.671875 Z M 16.390625 0.824219 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="d98578a2fa">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="57d5e3bb6a">
          <path
            d="M 47 47 L 80 47 L 80 80 L 47 80 Z M 47 47 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="43b9da702b">
          <path
            d="M 63.390625 47.542969 L 79.238281 63.390625 L 63.390625 79.238281 L 47.542969 63.390625 Z M 63.390625 47.542969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="ba39b99510">
          <path
            d="M 0.335938 0.335938 L 32.367188 0.335938 L 32.367188 32.367188 L 0.335938 32.367188 Z M 0.335938 0.335938 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="578ae0a219">
          <path
            d="M 16.390625 0.542969 L 32.238281 16.390625 L 16.390625 32.238281 L 0.542969 16.390625 Z M 16.390625 0.542969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="8705cfd779">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="01eb256c5d">
          <path
            d="M 47 42 L 80 42 L 80 74 L 47 74 Z M 47 42 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="2b7767c5b1">
          <path
            d="M 63.390625 42.261719 L 79.238281 58.109375 L 63.390625 73.957031 L 47.542969 58.109375 Z M 63.390625 42.261719 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="21b3727340">
          <path
            d="M 0.335938 0.0742188 L 32.367188 0.0742188 L 32.367188 32 L 0.335938 32 Z M 0.335938 0.0742188 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="14494c817b">
          <path
            d="M 16.390625 0.261719 L 32.238281 16.109375 L 16.390625 31.957031 L 0.542969 16.109375 Z M 16.390625 0.261719 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="30f0e74687">
          <rect x="0" width="33" y="0" height="32" />
        </clipPath>
        <clipPath id="e34513e56e">
          <path
            d="M 47 89 L 80 89 L 80 122 L 47 122 Z M 47 89 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="4fd72cdc7d">
          <path
            d="M 63.390625 89.804688 L 79.238281 105.652344 L 63.390625 121.5 L 47.542969 105.652344 Z M 63.390625 89.804688 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="6ed377f790">
          <path
            d="M 0.335938 0.648438 L 32.367188 0.648438 L 32.367188 32.683594 L 0.335938 32.683594 Z M 0.335938 0.648438 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="bdb9c59643">
          <path
            d="M 16.390625 0.804688 L 32.238281 16.652344 L 16.390625 32.5 L 0.542969 16.652344 Z M 16.390625 0.804688 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="ad0f5c6406">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="342941c8a4">
          <path
            d="M 23 67 L 56 67 L 56 100 L 23 100 Z M 23 67 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="1e836e445f">
          <path
            d="M 39.621094 67.574219 L 55.46875 83.421875 L 39.621094 99.269531 L 23.773438 83.421875 Z M 39.621094 67.574219 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="f2f8eb3c23">
          <path
            d="M 0.667969 0.414062 L 32.703125 0.414062 L 32.703125 32.449219 L 0.667969 32.449219 Z M 0.667969 0.414062 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="36c9b5ba6b">
          <path
            d="M 16.621094 0.574219 L 32.46875 16.421875 L 16.621094 32.269531 L 0.773438 16.421875 Z M 16.621094 0.574219 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b90f702651">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
        <clipPath id="effa0bfa5e">
          <path
            d="M 71 67 L 104 67 L 104 100 L 71 100 Z M 71 67 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b9cfa42878">
          <path
            d="M 87.164062 67.574219 L 103.011719 83.421875 L 87.164062 99.269531 L 71.316406 83.421875 Z M 87.164062 67.574219 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="61e99d01f8">
          <path
            d="M 0.242188 0.414062 L 32.035156 0.414062 L 32.035156 32.449219 L 0.242188 32.449219 Z M 0.242188 0.414062 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b7b46a55ca">
          <path
            d="M 16.164062 0.574219 L 32.011719 16.421875 L 16.164062 32.269531 L 0.316406 16.421875 Z M 16.164062 0.574219 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="9fec21926e">
          <rect x="0" width="33" y="0" height="33" />
        </clipPath>
      </defs>
      <g clipPath="url(#5155b50983)">
        <g clipPath="url(#77a189c511)">
          <g transform="matrix(1, 0, 0, 1, 47, 5)">
            <g clipPath="url(#72acca8259)">
              <g clipPath="url(#861ffc5a94)">
                <g clipPath="url(#0a502ae665)">
                  <path
                    fill="#4299e1"
                    d="M 16.390625 0.28125 L 32.238281 16.128906 L 16.390625 31.976562 L 0.542969 16.128906 Z M 16.390625 0.28125 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#d4539c0fe0)">
        <g clipPath="url(#bd794d7811)">
          <g transform="matrix(1, 0, 0, 1, 47, 0.000000000000007293)">
            <g clipPath="url(#3e30aa1de7)">
              <g clipPath="url(#11d0ad14cf)">
                <g clipPath="url(#6ac7ba8b8a)">
                  <path
                    fill="#63b3ed"
                    d="M 16.390625 0 L 32.238281 15.847656 L 16.390625 31.695312 L 0.542969 15.847656 Z M 16.390625 0 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#79855f5e8a)">
        <g clipPath="url(#a5a1bf1ae5)">
          <g transform="matrix(1, 0, 0, 1, 95, 47)">
            <g clipPath="url(#7840780ca3)">
              <g clipPath="url(#49016e1aac)">
                <g clipPath="url(#bf074ca11c)">
                  <path
                    fill="#63b3ed"
                    d="M 15.933594 0.542969 L 31.78125 16.390625 L 15.933594 32.238281 L 0.0859375 16.390625 Z M 15.933594 0.542969 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#72cfaedf3c)">
        <g clipPath="url(#b81ef2191e)">
          <g transform="matrix(1, 0, 0, 1, 71, 27)">
            <g clipPath="url(#b1c2c88a5d)">
              <g clipPath="url(#ad904cea85)">
                <g clipPath="url(#a4ea3c3ada)">
                  <path
                    fill="#4299e1"
                    d="M 16.164062 0.53125 L 32.011719 16.378906 L 16.164062 32.226562 L 0.316406 16.378906 Z M 16.164062 0.53125 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#e9f77bb432)">
        <g clipPath="url(#06fc6dad84)">
          <g transform="matrix(1, 0, 0, 1, 71, 23)">
            <g clipPath="url(#0443993d8d)">
              <g clipPath="url(#a453a051dc)">
                <g clipPath="url(#6356c7b1cf)">
                  <path
                    fill="#63b3ed"
                    d="M 16.164062 0.773438 L 32.011719 16.621094 L 16.164062 32.46875 L 0.316406 16.621094 Z M 16.164062 0.773438 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#fa988aa41e)">
        <g clipPath="url(#f4bd81b161)">
          <g transform="matrix(1, 0, 0, 1, 23, 27)">
            <g clipPath="url(#61c6d8ecc5)">
              <g clipPath="url(#0dc8f78be8)">
                <g clipPath="url(#be6756465c)">
                  <path
                    fill="#4299e1"
                    d="M 16.621094 0.53125 L 32.46875 16.378906 L 16.621094 32.226562 L 0.773438 16.378906 Z M 16.621094 0.53125 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#d5641d46a5)">
        <g clipPath="url(#3526a79847)">
          <g transform="matrix(1, 0, 0, 1, 23, 23)">
            <g clipPath="url(#40cd709127)">
              <g clipPath="url(#9f6e78aa24)">
                <g clipPath="url(#505445cfdb)">
                  <path
                    fill="#63b3ed"
                    d="M 16.621094 0.773438 L 32.46875 16.621094 L 16.621094 32.46875 L 0.773438 16.621094 Z M 16.621094 0.773438 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#1acbea7e79)">
        <g clipPath="url(#e14755a91e)">
          <g transform="matrix(1, 0, 0, 1, 0, 47)">
            <g clipPath="url(#bb998a6e3d)">
              <g clipPath="url(#719d78f8ba)">
                <g clipPath="url(#bf06bd712a)">
                  <path
                    fill="#63b3ed"
                    d="M 15.847656 0.542969 L 31.695312 16.390625 L 15.847656 32.238281 L 0 16.390625 Z M 15.847656 0.542969 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#3c29484c10)">
        <g clipPath="url(#c887000932)">
          <g transform="matrix(1, 0, 0, 1, 23, 71)">
            <g clipPath="url(#03b42890a1)">
              <g clipPath="url(#1b8da7612c)">
                <g clipPath="url(#21db3ec568)">
                  <path
                    fill="#4299e1"
                    d="M 16.621094 0.316406 L 32.46875 16.164062 L 16.621094 32.011719 L 0.773438 16.164062 Z M 16.621094 0.316406 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#233331eb39)">
        <g clipPath="url(#b01d2f4a3a)">
          <g transform="matrix(1, 0, 0, 1, 47, 95)">
            <g clipPath="url(#c58a927306)">
              <g clipPath="url(#68bb0fa720)">
                <g clipPath="url(#e9a141cd4b)">
                  <path
                    fill="#4299e1"
                    d="M 16.390625 0.0859375 L 32.238281 15.933594 L 16.390625 31.78125 L 0.542969 15.933594 Z M 16.390625 0.0859375 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#bca5b08979)">
        <g clipPath="url(#b38f01287a)">
          <g transform="matrix(1, 0, 0, 1, 71, 71)">
            <g clipPath="url(#b3a53d8bbb)">
              <g clipPath="url(#f952b4f88f)">
                <g clipPath="url(#003988a10c)">
                  <path
                    fill="#4299e1"
                    d="M 16.164062 0.316406 L 32.011719 16.164062 L 16.164062 32.011719 L 0.316406 16.164062 Z M 16.164062 0.316406 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#140533dd3c)">
        <g clipPath="url(#90a2792241)">
          <g transform="matrix(1, 0, 0, 1, 47, 52)">
            <g clipPath="url(#d98578a2fa)">
              <g clipPath="url(#8b86bc1f42)">
                <g clipPath="url(#f10ad16fb6)">
                  <path
                    fill="#3182ce"
                    d="M 16.390625 0.824219 L 32.238281 16.671875 L 16.390625 32.519531 L 0.542969 16.671875 Z M 16.390625 0.824219 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#57d5e3bb6a)">
        <g clipPath="url(#43b9da702b)">
          <g transform="matrix(1, 0, 0, 1, 47, 47)">
            <g clipPath="url(#8705cfd779)">
              <g clipPath="url(#ba39b99510)">
                <g clipPath="url(#578ae0a219)">
                  <path
                    fill="#4299e1"
                    d="M 16.390625 0.542969 L 32.238281 16.390625 L 16.390625 32.238281 L 0.542969 16.390625 Z M 16.390625 0.542969 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#01eb256c5d)">
        <g clipPath="url(#2b7767c5b1)">
          <g transform="matrix(1, 0, 0, 1, 47, 42)">
            <g clipPath="url(#30f0e74687)">
              <g clipPath="url(#21b3727340)">
                <g clipPath="url(#14494c817b)">
                  <path
                    fill="#63b3ed"
                    d="M 16.390625 0.261719 L 32.238281 16.109375 L 16.390625 31.957031 L 0.542969 16.109375 Z M 16.390625 0.261719 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#e34513e56e)">
        <g clipPath="url(#4fd72cdc7d)">
          <g transform="matrix(1, 0, 0, 1, 47, 89)">
            <g clipPath="url(#ad0f5c6406)">
              <g clipPath="url(#6ed377f790)">
                <g clipPath="url(#bdb9c59643)">
                  <path
                    fill="#63b3ed"
                    d="M 16.390625 0.804688 L 32.238281 16.652344 L 16.390625 32.5 L 0.542969 16.652344 Z M 16.390625 0.804688 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#342941c8a4)">
        <g clipPath="url(#1e836e445f)">
          <g transform="matrix(1, 0, 0, 1, 23, 67)">
            <g clipPath="url(#b90f702651)">
              <g clipPath="url(#f2f8eb3c23)">
                <g clipPath="url(#36c9b5ba6b)">
                  <path
                    fill="#63b3ed"
                    d="M 16.621094 0.574219 L 32.46875 16.421875 L 16.621094 32.269531 L 0.773438 16.421875 Z M 16.621094 0.574219 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#effa0bfa5e)">
        <g clipPath="url(#b9cfa42878)">
          <g transform="matrix(1, 0, 0, 1, 71, 67)">
            <g clipPath="url(#9fec21926e)">
              <g clipPath="url(#61e99d01f8)">
                <g clipPath="url(#b7b46a55ca)">
                  <path
                    fill="#63b3ed"
                    d="M 16.164062 0.574219 L 32.011719 16.421875 L 16.164062 32.269531 L 0.316406 16.421875 Z M 16.164062 0.574219 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </Svg>
  );
};
