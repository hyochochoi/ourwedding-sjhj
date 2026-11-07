export const COVER_PHOTO = "/wedding-cover.jpg";
export const WEDDING_PHOTOS = Array.from({ length: 24 }, (_, i) => ({
  src: `/wedding-gallery/${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `상진과 효정의 순간 ${i + 1}`,
}));
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
