export const COVER_PHOTO = "/wedding-cover.jpg";
const weddingPhotoNumbers = [1, 3, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 17, 20, 19, 18, 21, 22];
export const WEDDING_PHOTOS = weddingPhotoNumbers.map((photoNumber) => ({
  src: `/wedding-gallery/${String(photoNumber).padStart(2, "0")}.jpg`,
  alt: `상진과 효정의 순간 ${photoNumber}`,
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
