import config from '../config/config';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as AppleStrategy } from 'passport-apple'
import { Strategy as KakaoStrategy } from 'passport-kakao'

/*  Google AUTH  */

export const googleStrategy = new GoogleStrategy({
  clientID: config.google.client_id,
  clientSecret: config.google.client_secret,
  callbackURL: config.google.callback_url,
}, function (accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
})

/*  Facebook AUTH  */

export const facebookStrategy = new FacebookStrategy({
  clientID: config.facebook.client_id,
  clientSecret: config.facebook.client_secret,
  callbackURL: config.facebook.callback_url,
  profileFields: ['id', 'displayName', 'email', 'first_name', 'middle_name', 'last_name']
}, function (accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}
)

/*  Apple AUTH  */
/*
export const appleStrategy = new AppleStrategy({
  clientID: config.apple.client_id,
  teamID: config.apple.team_id,
  callbackURL: config.apple.callback_url,
  keyID: config.apple.key_id,
  privateKeyLocation: config.apple.private_key_location,
}, function (req, accessToken, refreshToken, idToken, profile, cb) {
  // Here, check if the idToken exists in your database!
  cb(null, idToken);
}); */


/*  Kakao AUTH  */

export const kakaoStrategy = new KakaoStrategy({
  clientID: config.kakao.client_id,
  clientSecret: config.kakao.client_secret,
  callbackURL: config.kakao.callback_url,
}, function (accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}
)


