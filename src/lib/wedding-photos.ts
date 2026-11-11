export const COVER_PHOTO = "/wedding-cover.jpg";
export const SHARE_PHOTO_URL = "https://ourwedding-sjhj.lovable.app/og-wedding.jpg";
const weddingPhotoNumbers = [1, 3, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 17, 20, 19, 18, 21, 22];
const highResolutionPhotoUrls: Record<number, string> = {
  4: "https://ourwedding-sjhj.lovable.app/__l5e/assets-v1/7e3a0b8b-9e5c-43ec-a0b7-7b3584e0cf22/IMG_2756.jpeg",
  8: "https://ourwedding-sjhj.lovable.app/__l5e/assets-v1/c7db3d4a-3d72-40c8-99a4-d249a1028e84/IMG_2804.jpeg",
  9: "https://ourwedding-sjhj.lovable.app/__l5e/assets-v1/637066df-2e0b-4da6-999f-53d1f672f311/IMG_2811.jpeg",
};
const landscapePhotoNumbers = new Set([12, 21]);

export const WEDDING_PHOTOS = weddingPhotoNumbers.map((photoNumber) => {
  const highResolutionSrc = highResolutionPhotoUrls[photoNumber];
  const dimensions = highResolutionSrc
    ? { width: 1280, height: 1920 }
    : landscapePhotoNumbers.has(photoNumber)
      ? { width: 1152, height: 768 }
      : { width: 768, height: 1152 };

  return {
    src:
      highResolutionSrc ?? `/wedding-gallery/${String(photoNumber).padStart(2, "0")}.jpg`,
    alt: `상진과 효정의 순간 ${photoNumber}`,
    ...dimensions,
  };
});
const invitationFilmPhotoFiles = [
  "KakaoTalk_20261107_115540288.jpg",
  "KakaoTalk_20261107_115540288_01.jpg",
  "KakaoTalk_20261107_115540288_02.jpg",
  "KakaoTalk_20261107_115540288_03.jpg",
  "KakaoTalk_20261107_115540288_04.jpg",
  "KakaoTalk_20261107_115540288_05.jpg",
  "KakaoTalk_20261107_115540288_06.jpg",
  "KakaoTalk_20261107_115540288_07.jpg",
  "KakaoTalk_20261107_115540288_09.jpg",
  "KakaoTalk_20261107_115540288_10.jpg",
  "KakaoTalk_20261107_115540288_11.jpg",
  "KakaoTalk_20261107_115540288_12.jpg",
  "KakaoTalk_20261107_115540288_15.jpg",
  "KakaoTalk_20261107_115540288_16.jpg",
  "KakaoTalk_20261107_115540288_18.jpg",
  "KakaoTalk_20261107_115540288_19.jpg",
  "KakaoTalk_20261107_115540288_20.jpg",
  "KakaoTalk_20261107_115540288_21.jpg",
  "KakaoTalk_20261107_115540288_22.jpg",
  "KakaoTalk_20261107_115729175.jpg",
  "KakaoTalk_20261107_115729175_01.jpg",
  "KakaoTalk_20261107_115729175_02.jpg",
  "KakaoTalk_20261107_115729175_03.jpg",
  "KakaoTalk_20261107_115729175_04.jpg",
  "KakaoTalk_20261107_115729175_05.jpg",
  "KakaoTalk_20261107_115729175_06.jpg",
  "KakaoTalk_20261107_115729175_07.jpg",
] as const;
export const INVITATION_FILM_PHOTOS = invitationFilmPhotoFiles.map((file, i) => ({
  src: `/invitation-film/${file}`,
  alt: `상진과 효정의 추억 ${i + 1}`,
}));
