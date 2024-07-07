import {
  convertDateFormat,
  convertKRLocaleStringFormat,
  convertKoreanStringFormat,
  convertNumberToCSSBackground,
  convertNumberToCSSTextShadow,
} from 'src/common/utils/utils';
import {
  LottoHighestPrizeInfoInterface,
  LottoInfoInterface,
  LottoStatisticInfoInterface,
} from '../../interface/lotto.interface';

export const emailTemplate = (
  lottoInfo: LottoInfoInterface,
  lottoStatisticInfo: LottoStatisticInfoInterface,
  lottoHighestPrizeInfo: LottoHighestPrizeInfoInterface
) => {
  return `<!DOCTYPE html>
  <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <!--<![endif]-->
      <style>
        @font-face {
          font-family: 'Nanum Gothic';
          src: url('NanumGothic-Regular.ttf') format('truetype');
        }
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'Nanum Gothic', sans-serif;
        }
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }
        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0;
          overflow: hidden;
        }
        .image_block img + div {
          display: none;
        }
  
        @media (max-width: 620px) {
          .social_block.desktop_hide .social-table {
            display: inline-block !important;
          }
          .image_block div.fullWidth {
            max-width: 100% !important;
          }
          .mobile_hide {
            display: none;
          }
          .row-content {
            width: 100% !important;
          }
          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0;
          }
          .desktop_hide,
          .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
        }
      </style>
    </head>
    <body
      style="background-color: #f4f4f4; -webkit-text-size-adjust: none; text-size-adjust: none"
    >
      <table
        class="nl-container"
        width="100%"
        role="presentation"
        style="background-color: #f4f4f4"
      >
        <tbody>
          <tr>
            <td>
              <!-- 로고 테이블 (row row-1) -->
              <table
                class="row row-1"
                align="center"
                width="100%"
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        role="presentation"
                        style="
                          background-color: #fff;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="50%"
                              align="center"
                              style="
                                padding-bottom: 25px;
                                padding-left: 10px;
                                padding-right: 10px;
                                padding-top: 25px;
                                vertical-align: bottom;
                              "
                            >
                              <table
                                class="image_block block-1"
                                width="100%"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad" style="width: 100%">
                                    <div>
                                      <img
                                        src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/0bd8b69e-4024-4f26-9010-6e2a146401fb/LOTTERY.png"
                                        style="
                                          display: block; 
                                          height: auto; 
                                          width: 100%
                                        "
                                        alt="logo"
                                        title="logo"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-1"
                              width="50%"
                              style="
                                padding-right: 30px;
                                padding-bottom: 15px;
                                vertical-align: bottom;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad" style="width: 100%">
                                    <div>
                                      <p
                                        style="
                                          font-weight: 400;
                                          font-size: 14px;
                                          text-align: right;
                                          color: #555;
                                        "
                                      >
                                        <strong>
                                          <span>
                                            ${convertDateFormat(lottoInfo.drwNoDate)} 추첨결과
                                          </span>
                                        </strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 상단 타이틀(추첨회차 & 당첨번호) 테이블 (row row-2) -->
              <table
                class="row row-2"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        role="presentation"
                        style="
                          background-color: #1a7616;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              align="center"
                              style="
                                padding-bottom: 35px;
                                padding-left: 50px;
                                padding-right: 50px;
                                padding-top: 50px;
                                vertical-align: center;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad" style="width: 100%">
                                    <strong>
                                      <p
                                        style="
                                          color: #fff;
                                          font-size: 40px;
                                          text-align: center;
                                          font-weight: 400; 
                                          word-break: break-word
                                        "
                                      >
                                        ${lottoInfo.drwNo}회 당첨결과 🍀
                                      </p>
                                    </strong>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="10"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #1a7616;
                          width: 600px;
                          height: 100px;
                          padding: 10px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="14%"
                              style="
                                border-top-left-radius: 50%;
                                border-bottom-left-radius: 50%;
                                background-color: #fff;
                                margin-bottom: 20px;
                                margin-top: 20px;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        word-break: break-word;
                                        text-align: center;
                                        height: 40px;
                                        line-height: 40px;
                                      "
                                    >
                                      <p
                                        style="
                                          display: inline-block; 
                                          border-radius: 100%; 
                                          color: #fff; 
                                          font-weight: 500; 
                                          width: 40px; 
                                          height: 40px; 
                                          margin: 0;
                                          background: ${convertNumberToCSSBackground(lottoInfo.drwtNo1)}; 
                                          text-shadow: ${convertNumberToCSSTextShadow(lottoInfo.drwtNo1)};"
                                      >
                                        ${lottoInfo.drwtNo1}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              width="14%"
                              style="
                                background-color: #fff;
                                margin-bottom: 20px;
                                margin-top: 20px;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad">
                                    <div>
                                      <div
                                        style="
                                          font-size: 15px;
                                          text-align: center;
                                          vertical-align: middle;
                                          height: 40px;
                                          line-height: 40px
                                        "
                                      >
                                        <p
                                          style="
                                            display: inline-block; 
                                            border-radius: 100%; 
                                            vertical-align: middle; 
                                            color: #fff; 
                                            font-weight: 500; 
                                            width: 40px; 
                                            height: 40px; 
                                            margin: 0;
                                            background: ${convertNumberToCSSBackground(lottoInfo.drwtNo2)}; 
                                            text-shadow: ${convertNumberToCSSTextShadow(lottoInfo.drwtNo2)};
                                          "
                                        >
                                          ${lottoInfo.drwtNo2}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-3"
                              width="14%"
                              style="
                                background-color: #fff;
                                font-weight: 400;
                                margin-bottom: 20px;
                                margin-top: 20px;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad">
                                    <div>
                                      <div
                                        style="
                                          font-size: 15px;
                                          text-align: center;
                                          vertical-align: middle;
                                          height: 40px;
                                          line-height: 40px
                                        "
                                      >
                                        <p
                                          style="
                                            display: inline-block; border-radius: 100%; vertical-align: middle; 
                                            color: #fff; 
                                            font-weight: 500; 
                                            width: 40px; 
                                            height: 40px; 
                                            margin: 0;
                                            background: ${convertNumberToCSSBackground(lottoInfo.drwtNo3)}; 
                                            text-shadow: ${convertNumberToCSSTextShadow(lottoInfo.drwtNo3)};
                                          "
                                        >
                                          ${lottoInfo.drwtNo3}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-4"
                              width="14%"
                              style="
                                background-color: #fff;
                                font-weight: 400;
                                margin-bottom: 20px;
                                margin-top: 20px;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad">
                                    <div>
                                      <div
                                        style="
                                          font-size: 15px;
                                          text-align: center;
                                          vertical-align: middle;
                                          height: 40px;
                                          line-height: 40px
                                        "
                                      >
                                        <p
                                          style="
                                            display: inline-block; border-radius: 100%; vertical-align: middle; 
                                            color: #fff; 
                                            font-weight: 500; 
                                            width: 40px; 
                                            height: 40px;
                                            margin: 0;
                                            background: ${convertNumberToCSSBackground(lottoInfo.drwtNo4)}; 
                                            text-shadow: ${convertNumberToCSSTextShadow(lottoInfo.drwtNo4)};
                                          "
                                        >
                                          ${lottoInfo.drwtNo4}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-5"
                              width="14%"
                              style="
                                background-color: #fff;
                                font-weight: 400;
                                margin-bottom: 20px;
                                margin-top: 20px;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad">
                                    <div>
                                      <div
                                        style="
                                          font-size: 15px;
                                          text-align: center;
                                          vertical-align: middle;
                                          height: 40px;
                                          line-height: 40px
                                        "
                                      >
                                        <p
                                          style="
                                            display: inline-block; 
                                            border-radius: 100%; 
                                            vertical-align: middle; 
                                            color: #fff; 
                                            font-weight: 500; 
                                            width: 40px; 
                                            height: 40px; 
                                            margin: 0;
                                            background: ${convertNumberToCSSBackground(lottoInfo.drwtNo5)}; 
                                            text-shadow: ${convertNumberToCSSTextShadow(lottoInfo.drwtNo5)};
                                          "
                                        >
                                          ${lottoInfo.drwtNo5}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-6"
                              width="14%"
                              style="
                                border-top-right-radius: 50%;
                                border-bottom-right-radius: 50%;
                                background-color: #fff;
                                font-weight: 400;
                                vertical-align: middle;
                                margin-right: 5px;
                                margin-bottom: 20px;
                                margin-top: 20px;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad">
                                    <div>
                                      <div
                                        style="
                                          font-size: 15px;
                                          text-align: center;
                                          vertical-align: middle;
                                          height: 40px;
                                          line-height: 40px
                                        "
                                      >
                                        <p
                                          style="
                                            display: inline-block; border-radius: 100%; vertical-align: middle; 
                                            color: #fff; 
                                            font-weight: 500; 
                                            width: 40px; 
                                            height: 40px; 
                                            margin: 0;
                                            background: ${convertNumberToCSSBackground(lottoInfo.drwtNo6)}; 
                                            text-shadow: ${convertNumberToCSSTextShadow(lottoInfo.drwtNo6)};
                                          "
                                        >
                                          ${lottoInfo.drwtNo6}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-7"
                              width="16%"
                              style="
                                font-weight: 400;
                                text-align: center;
                                vertical-align: middle;
                                margin-bottom: 20px;
                                margin-top: 20px;
                              "
                            >
                              <table
                                class="text_block block-7"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad">
                                    <div>
                                      <div
                                        style="
                                          font-size: 15px;
                                          text-align: center;
                                          vertical-align: middle;
                                          height: 40px;
                                          line-height: 40px
                                        "
                                      >
                                        <p
                                          style="
                                            display: inline-block; border-radius: 100%; vertical-align: middle; 
                                            color: #fff; 
                                            font-weight: 500; 
                                            width: 40px; 
                                            height: 40px; 
                                            margin: 0;
                                            background: ${convertNumberToCSSBackground(lottoInfo.bnusNo)}; 
                                            text-shadow: ${convertNumberToCSSTextShadow(lottoInfo.bnusNo)};
                                          "
                                        >
                                          ${lottoInfo.bnusNo}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 빈 공간 테이블 (row row-3) -->
              <table
                class="row row-3"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #1a7616;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      class="spacer_block block-1"
                                      style="height: 60px; line-height: 60px;"
                                    >
                                      &#8202;
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 구분선 테이블 (row row-4) -->
              <table
                class="row row-4"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          padding-top: 20px; 
                          padding-bottom: 20px; 
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              align="center"
                            >
                              <table
                                class="text_block block-1"
                                width="95%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="divider_inner"
                                    style="font-size: 1px; line-height: 1px; border-top: 1px solid #bbb"
                                  >
                                    <span>&#8202;</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 라벨 안내 테이블 (row row-5) -->
              <table
                class="row row-5"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="vertical-align: middle"
                            >
                              <table
                                class="text_block block-1"
                                width="95%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 2.5px;"
                                  >
                                    <div
                                      style="
                                        color: #bbb;
                                        font-weight: 400;
                                        font-size: 12px;
                                        letter-spacing: 0;
                                        line-height: 100%;
                                        text-align: right;
                                      "
                                    >
                                      <p><strong>* (인원 / 금액)</strong></p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 1등 당첨자 라벨 테이블 (row row-6) -->
              <table
                class="row row-6"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                font-weight: 400;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-bottom: 5px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        color: #000;
                                        direction: ltr;
                                        font-size: 16px;
                                        font-weight: 900;
                                        letter-spacing: 0;
                                        line-height: 200%;
                                        text-align: center;
                                        mso-line-height-alt: 30px;
                                      "
                                    >
                                      <p><strong>🥇 1등 당첨자</strong></p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 1등 당첨자 데이터 테이블 (row row-7) -->
              <table
                class="row row-7"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        color: #000;
                                        direction: ltr;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0;
                                        line-height: 120%;
                                        text-align: center;
                                      "
                                    >
                                      <p>
                                        <strong>
                                          <span>
                                            ${convertKRLocaleStringFormat(lottoInfo.firstPrzwnerCo)}명 / 
                                          </span>
                                          <span style="color: #c3421f">
                                            ${convertKoreanStringFormat(lottoInfo.firstWinamnt)}원
                                          </span>
                                        </strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 2등 당첨자 라벨 테이블 (row row-8) -->
              <table
                class="row row-8"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 20px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        color: #000;
                                        direction: ltr;
                                        font-size: 16px;
                                        font-weight: 900;
                                        letter-spacing: 0;
                                        line-height: 200%;
                                        text-align: center;
                                        mso-line-height-alt: 30px;
                                      "
                                    >
                                      <p><strong>🥈 2등 당첨자</strong></p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 2등 당첨자 데이터 테이블 (row row-9) -->
              <table
                class="row row-9"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        color: #000;
                                        direction: ltr;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0;
                                        line-height: 120%;
                                        text-align: center;
                                      "
                                    >
                                      <p>
                                        <strong>
                                          <span>
                                            ${convertKRLocaleStringFormat(lottoInfo.secondPrzwnerCo)}명 / 
                                          </span>
                                          <span style="color: #c3421f">
                                            ${convertKoreanStringFormat(lottoInfo.secondWinamnt)}원
                                          </span>
                                        </strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 3등 당첨자 라벨 테이블 (row row-10) -->
              <table
                class="row row-10"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 20px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        color: #000;
                                        direction: ltr;
                                        font-size: 16px;
                                        font-weight: 900;
                                        letter-spacing: 0;
                                        line-height: 200%;
                                        text-align: center;
                                        mso-line-height-alt: 30px;
                                      "
                                    >
                                      <p><strong>🥉 3등 당첨자</strong></p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 3등 당첨자 데이터 테이블 (row row-11) -->
              <table
                class="row row-11"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 5px; padding-bottom: 20px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        color: #000;
                                        direction: ltr;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0;
                                        line-height: 120%;
                                        text-align: center;
                                        mso-line-height-alt: 16.8px;
                                      "
                                    >
                                      <p>
                                        <strong>
                                          <span>
                                            ${convertKRLocaleStringFormat(lottoInfo.thirdPrzwnerCo)}명 / 
                                          </span>
                                          <span style="color: #c3421f">
                                            ${convertKoreanStringFormat(lottoInfo.thirdWinamnt)}원
                                          </span>
                                        </strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 구분선 테이블 (row row-12) -->
              <table
                class="row row-12"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          padding-top: 20px; 
                          padding-bottom: 20px; 
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              align="center"
                            >
                              <table
                                class="text_block block-1"
                                width="95%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="divider_inner"
                                    style="font-size: 1px; line-height: 1px; border-top: 1px solid #bbb"
                                  >
                                    <span>&#8202;</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 라벨 안내 테이블 (row row-13) -->
              <table
                class="row row-13"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="vertical-align: middle"
                            >
                              <table
                                class="text_block block-1"
                                width="95%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 2.5px;"
                                  >
                                    <div
                                      style="
                                        color: #bbb;
                                        font-weight: 400;
                                        font-size: 12px;
                                        letter-spacing: 0;
                                        line-height: 100%;
                                        text-align: right;
                                      "
                                    >
                                      <p><strong>* (보너스 번호 포함)</strong></p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 역대 통계 라벨 테이블 (row row-14) -->
              <table
                class="row row-14"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                padding-top: 20px;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad" style="text-align: center; color: #555;">
                                    <strong><p style="font-size: 20px;">역대 최다 당첨 번호</p></strong>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 빈 공간 테이블 (row row-15) -->
              <table
                class="row row-15"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      class="spacer_block block-1"
                                      style="height: 60px; line-height: 60px;"
                                    >
                                      &#8202;
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 통계 번호 테이블 (row row-16) -->
              <table
                class="row row-16"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="10"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          height: 100px;
                          margin: 0 auto;
                          padding-left: 60px;
                          padding-right: 60px;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="33.3%"
                              style="
                                margin-bottom: 20px;
                                margin-top: 20px;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td 
                                    class="pad"
                                    style="padding-top: 5px;"
                                  >
                                    <div 
                                      style="
                                        font-size: 13px;
                                        text-align: center;
                                        height: 40px;
                                        line-height: 30px
                                      "
                                    >
                                      <div
                                        style="
                                          font-size: 15px;
                                          height: 40px;
                                          line-height: 40px
                                        "
                                      >
                                        <p
                                          style="display: inline-block; border-radius: 100%; vertical-align: middle; color: #fff; font-weight: 500; width: 40px; height: 40px; background: ${convertNumberToCSSBackground(
                                            lottoStatisticInfo.secondLottoNo
                                          )}; text-shadow: ${convertNumberToCSSTextShadow(
    lottoStatisticInfo.secondLottoNo
  )};"
                                        >
                                          ${lottoStatisticInfo.secondLottoNo}
                                        </p>
                                      </div>
                                      <strong>
                                        <p style="font-size: 16px">
                                          🥈 2등 (${lottoStatisticInfo.secondLottoNoCnt}회)
                                        </p>
                                      </strong>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              width="33.3%"
                              style="
                                margin-bottom: 20px;
                                margin-top: 20px;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td 
                                    class="pad"
                                    style="padding-top: 5px;"
                                  >
                                    <div 
                                      style="
                                        font-size: 13px;
                                        text-align: center;
                                        height: 40px;
                                        line-height: 30px
                                      "
                                    >
                                      <div
                                        style="
                                          font-size: 15px;
                                          height: 40px;
                                          line-height: 40px
                                        "
                                      >
                                        <p
                                          style="display: inline-block; border-radius: 100%; vertical-align: middle; color: #fff; font-weight: 500; width: 40px; height: 40px; background: ${convertNumberToCSSBackground(
                                            lottoStatisticInfo.firstLottoNo
                                          )}; text-shadow: ${convertNumberToCSSTextShadow(
    lottoStatisticInfo.firstLottoNo
  )};"
                                        >
                                          ${lottoStatisticInfo.firstLottoNo}
                                        </p>
                                      </div>
                                      <strong>
                                        <p style="font-size: 16px">
                                          🥇 1등 (${lottoStatisticInfo.firstLottoNoCnt}회)
                                        </p>
                                      </strong>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-3"
                              width="33.3%"
                              style="
                                margin-bottom: 20px;
                                margin-top: 20px;
                                vertical-align: middle;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td 
                                    class="pad"
                                    style="padding-top: 5px;"
                                  >
                                    <div 
                                      style="
                                        font-size: 13px;
                                        text-align: center;
                                        height: 40px;
                                        line-height: 30px
                                      "
                                    >
                                      <div
                                        style="
                                          font-size: 15px;
                                          height: 40px;
                                          line-height: 40px
                                        "
                                      >
                                        <p
                                          style="
                                            display: inline-block; border-radius: 100%; vertical-align: middle; color: #fff; font-weight: 500; width: 40px; height: 40px; background: ${convertNumberToCSSBackground(
                                              lottoStatisticInfo.thirdLottoNo
                                            )}; text-shadow: ${convertNumberToCSSTextShadow(
    lottoStatisticInfo.thirdLottoNo
  )};
                                          "
                                        >
                                          ${lottoStatisticInfo.thirdLottoNo}
                                        </p>
                                      </div>
                                      <strong>
                                        <p style="font-size: 16px">
                                          🥉 3등 (${lottoStatisticInfo.thirdLottoNoCnt}회)
                                        </p>
                                      </strong>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 빈 공간 테이블 (row row-17) -->
              <table
                class="row row-17"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      class="spacer_block block-1"
                                      style="height: 60px; line-height: 60px;"
                                    >
                                      &#8202;
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 구분선 테이블 (row row-18) -->
              <table
                class="row row-18"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          padding-top: 20px; 
                          padding-bottom: 20px; 
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              align="center"
                            >
                              <table
                                class="text_block block-1"
                                width="95%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="divider_inner"
                                    style="font-size: 1px; line-height: 1px; border-top: 1px solid #bbb"
                                  >
                                    <span>&#8202;</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 라벨 안내 테이블 (row row-19) -->
              <table
                class="row row-19"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="vertical-align: middle"
                            >
                              <table
                                class="text_block block-1"
                                width="95%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 2.5px;"
                                  >
                                    <div
                                      style="
                                        color: #bbb;
                                        font-weight: 400;
                                        font-size: 12px;
                                        letter-spacing: 0;
                                        line-height: 100%;
                                        text-align: right;
                                      "
                                    >
                                      <p><strong>* (최근 2년간 최고 당첨 금액)</strong></p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 연도 통계 라벨 테이블 (row row-20) -->
              <table
                class="row row-20"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                padding-top: 20px;
                                vertical-align: top;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad" style="text-align: center; color: #555;">
                                    <strong><p style="font-size: 20px;">최고 당첨 금액 정보</p></strong>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 빈 공간 테이블 (row row-21) -->
              <table
                class="row row-21"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      class="spacer_block block-1"
                                      style="height: 60px; line-height: 60px;"
                                    >
                                      &#8202;
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 연도별 당첨 정보 라벨 테이블 (row row-22) -->
              <table
                class="row row-22"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="50%"
                              style="vertical-align: middle"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 20px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        direction: ltr;
                                        font-size: 16px;
                                        font-weight: 900;
                                        letter-spacing: 0;
                                        line-height: 150%;
                                        text-align: center;
                                        mso-line-height-alt: 30px;
                                      "
                                    >
                                      <p style="font-size: 15px">${convertDateFormat(
                                        lottoHighestPrizeInfo.thisYearDrwNoDate
                                      )} 추첨</p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              width="50%"
                              style="vertical-align: middle"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 20px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        color: #000;
                                        direction: ltr;
                                        font-size: 16px;
                                        font-weight: 900;
                                        letter-spacing: 0;
                                        line-height: 150%;
                                        text-align: center;
                                        mso-line-height-alt: 30px;
                                      "
                                    >
                                      <p style="font-size: 15px">${convertDateFormat(
                                        lottoHighestPrizeInfo.lastYearDrwNoDate
                                      )} 추첨</p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 연도별 당첨 정보 데이터 테이블 (row row-23) -->
              <table
                class="row row-23"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="50%"
                              style="vertical-align: middle"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        color: #000;
                                        direction: ltr;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0;
                                        line-height: 150%;
                                        text-align: center;
                                        mso-line-height-alt: 16.8px;
                                      "
                                    >
                                      <p>
                                        <strong>
                                          <span>
                                            ${convertKRLocaleStringFormat(lottoHighestPrizeInfo.thisYearDrwNo)}회 / 
                                          </span>
                                          <span style="color: #c3421f">
                                            ${convertKoreanStringFormat(lottoHighestPrizeInfo.thisYearFirstWinamnt)}원
                                          </span>
                                          <span>
                                            (${convertKRLocaleStringFormat(
                                              lottoHighestPrizeInfo.thisYearFirstPrzwnerCo
                                            )}명) 
                                          </span>
                                        </strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              width="50%"
                              style="vertical-align: middle"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px"
                                  >
                                    <div
                                      style="
                                        color: #000;
                                        direction: ltr;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0;
                                        line-height: 150%;
                                        text-align: center;
                                        mso-line-height-alt: 16.8px;
                                      "
                                    >
                                      <p>
                                        <strong>
                                          <span>
                                            ${convertKRLocaleStringFormat(lottoHighestPrizeInfo.lastYearDrwNo)}회 / 
                                          </span>
                                          <span style="color: #c3421f">
                                            ${convertKoreanStringFormat(lottoHighestPrizeInfo.lastYearFirstWinamnt)}원
                                          </span>
                                          <span>
                                            (${convertKRLocaleStringFormat(
                                              lottoHighestPrizeInfo.lastYearFirstPrzwnerCo
                                            )}명) 
                                          </span>
                                        </strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 빈 공간 테이블 (row row-24) -->
              <table
                class="row row-24"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      class="spacer_block block-1"
                                      style="height: 60px; line-height: 60px;"
                                    >
                                      &#8202;
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 구분선 테이블 (row row-25) -->
              <table
                class="row row-25"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          padding-top: 20px; 
                          padding-bottom: 20px; 
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              align="center"
                            >
                              <table
                                class="text_block block-1"
                                width="95%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="divider_inner"
                                    style="font-size: 1px; line-height: 1px; border-top: 1px solid #bbb"
                                  >
                                    <span>&#8202;</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 라벨 안내 테이블 (row row-26) -->
              <table
                class="row row-26"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="vertical-align: middle"
                            >
                              <table
                                class="text_block block-1"
                                width="95%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="padding-top: 2.5px;"
                                  >
                                    <div
                                      style="
                                        color: #bbb;
                                        font-weight: 400;
                                        font-size: 12px;
                                        letter-spacing: 0;
                                        line-height: 100%;
                                        text-align: right;
                                      "
                                    >
                                      <p><strong>* (23년 1월 1일부터)</strong></p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 연도 통계 라벨 테이블 (row row-27) -->
              <table
                class="row row-27"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                padding-top: 20px;
                                vertical-align: top;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad" style="text-align: center; color: #555;">
                                    <strong><p style="font-size: 20px;"> 로또 세금 정보</p></strong>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 빈 공간 테이블 (row row-28) -->
              <table
                class="row row-28"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      class="spacer_block block-1"
                                      style="height: 60px; line-height: 60px;"
                                    >
                                      &#8202;
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 세금 정보 테이블 (row row-29) -->
              <table
                class="row row-29"
                align="center"
                width="100%"
                
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              align="center"
                              style="vertical-align: middle"
                            >
                              <table
                                class="text_block block-1"
                                width="90%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      text-align: left; 
                                      font-size: 15px;
                                      font-weight: 900;
                                      padding-bottom: 5px;
                                      padding-right: 5px"
                                  >
                                    <p style="margin-bottom: 15px">
                                      <strong>📌 3억 이상: 세금 33% (소득세 30% + 주민세 3%)</strong>
                                    </p>
                                    <p style="margin-bottom: 15px">
                                      <strong>📌 3억 미만 200만원 초과: 세금 22% (소득세 20% + 주민세 2%)</strong>
                                    </p>
                                    <p>
                                      <strong>📌 200만원 이하: 세금 없음</strong>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 빈 공간 테이블 (row row-30) -->
              <table
                class="row row-30"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      class="spacer_block block-1"
                                      style="height: 60px; line-height: 60px;"
                                    >
                                      &#8202;
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 구분선 테이블 (row row-31) -->
              <table
                class="row row-31"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          padding-top: 20px; 
                          padding-bottom: 20px; 
                          background-color: #fff;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              align="center"
                            >
                              <table
                                class="text_block block-1"
                                width="95%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="divider_inner"
                                    style="font-size: 1px; line-height: 1px; border-top: 1px solid #bbb"
                                  >
                                    <span>&#8202;</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 버튼 테이블 (row row-32) -->
              <table
                class="row row-32"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                            >
                              <table
                                class="button_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="
                                  vertical-align: middle; 
                                  padding-bottom: 20px;
                                "
                              >
                                <tr>
                                  <td class="pad" style="text-align: center">
                                    <div class="alignment" align="center">
                                      <div
                                        style="
                                          text-decoration: none;
                                          display: inline-block;
                                          color: #fff;
                                          background-color: #555;
                                          border-radius: 4px;
                                          width: auto;
                                          border-top: 0 solid transparent;
                                          border-right: 0 solid transparent;
                                          border-bottom: 0 solid transparent;
                                          border-left: 0 solid transparent;
                                          padding-top: 5px;
                                          padding-bottom: 5px;
                                          font-weight: 900;
                                          font-size: 16px;
                                          text-align: center;
                                          mso-border-alt: none;
                                          word-break: keep-all;
                                        "
                                      >
                                        <span
                                          style="
                                            cursor: pointer;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            display: inline-block;
                                            letter-spacing: normal;
                                            word-break: break-word;
                                            line-height: 32px;
                                          "
                                        >
                                          <a
                                            style="text-decoration: none; color: #fff;"
                                            href="https://dhlottery.co.kr/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            동행복권 바로가기
                                          </a>
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 안내사항 테이블 (row row-33) -->
              <table
                class="row row-33"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #1a7616;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                font-weight: 400;
                                padding-bottom: 30px;
                                padding-left: 30px;
                                padding-right: 30px;
                                padding-top: 30px;
                                vertical-align: top;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td class="pad" style="padding-left: 10px; padding-right: 10px; padding-top: 10px">
                                    <div>
                                      <div
                                        class
                                        style="
                                          font-size: 12px;
                                          color: #fff;
                                          line-height: 1.2;
                                        "
                                      >
                                        <p
                                          style="
                                            margin-bottom: 10px;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 16.8px;
                                          "
                                        >
                                          <span style="font-size: 22px"><strong><span style="font-size: 22px">궁금하신 사항이 있으신가요? 🍀</span></strong></span>
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                class="text_block block-2"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 30px;
                                      padding-right: 30px;
                                      padding-top: 10px;
                                    "
                                  >
                                    <div>
                                      <div
                                        class
                                        style="
                                          font-size: 12px;
                                          mso-line-height-alt: 21.6px;
                                          color: #fff;
                                          line-height: 1.8;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 25.2px;
                                          "
                                        >
                                          문의사항이 있으시다면
                                          <a
                                            style="text-decoration: underline; color: #fff"
                                            href="#"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            >kk_ong2233@naver.com</a
                                          >
                                          주소로 회신 부탁드립니다.
                                        </p>
                                        <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 25.2px;
                                        "
                                        >
                                          혹은
                                          <a
                                            style="text-decoration: underline; color: #fff"
                                            href="https://lottery.jh8459.com/support.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            문의사항</a
                                          >
                                          을 남겨주시면 확인 후 답변드리겠습니다.
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 수신거부 테이블 (row row-34) -->
              <table
                class="row row-34"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                padding-top: 40px;
                                vertical-align: top;
                              "
                            >
                              <table
                                class="text_block block-1"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="word-break: break-word"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 20px;
                                      padding-left: 10px;
                                      padding-right: 10px;
                                      padding-top: 20px;
                                    "
                                  >
                                    <div>
                                      <div
                                        class
                                        style="
                                          font-size: 12px;
                                          mso-line-height-alt: 14.399999999999999px;
                                          color: #61626f;
                                          line-height: 1.2;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            font-weight: 400;
                                            mso-line-height-alt: 16.8px;
                                          "
                                        >
                                          <span style="font-size: 12px"><strong>구독을 취소하시고 싶으시다면 Github Repository를 방문해주세요.</strong></span>
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 소셜 & 테이블 (row row-35) -->
              <table
                class="row row-35"
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #f4f4f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          background-color: #fff;
                          color: #333;
                          width: 600px;
                          margin: 0 auto;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                padding-bottom: 45px;
                                padding-top: 30px;
                                vertical-align: top;
                              "
                            >
                              <table
                                class="social_block block-1"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style=" mso-table-rspace: 0"
                              >
                                <tr>
                                  <td class="pad">
                                    <div class="alignment" align="center">
                                      <table
                                        class="social-table"
                                        width="84px"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="display: inline-block"
                                      >
                                        <tr>
                                          <td style="padding: 0 10px 0 0">
                                            <a href="https://github.com/JH8459/LOTTERY" target="_blank"
                                              ><img
                                                src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/0bd8b69e-4024-4f26-9010-6e2a146401fb/github%20%281%29_1.png"
                                                width="32"
                                                height="32"
                                                alt="Github"
                                                title="Github"
                                                style="display: block; height: auto; border: 0"
                                            /></a>
                                          </td>
                                          <td style="padding: 0 10px 0 0">
                                            <a
                                              href="https://www.linkedin.com/in/%EC%A0%95%ED%98%84-%EA%B9%80-8b7a80237/"
                                              target="_blank"
                                              ><img
                                                src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/0bd8b69e-4024-4f26-9010-6e2a146401fb/linkedin%201.png"
                                                width="32"
                                                height="32"
                                                alt="LinkedIn"
                                                title="LinkedIn"
                                                style="display: block; height: auto; border: 0"
                                            /></a>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- End -->
    </body>
  </html>
  `;
};
