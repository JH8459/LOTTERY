const getFormattedSendTime = (date: Date): string => {
  // 현재 날짜를 기준으로 포맷팅된 문자열을 반환하는 함수입니다.
  const pad = (n) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 ${second}초`;
};

export const verificationCodeEmailTemplate = (verificationCode: string) => {
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
                                        src="https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery_logo.png"
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
                                            ${getFormattedSendTime(new Date())} 기준
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
              <!-- 구분선 테이블 (row row-2) -->
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
              <!-- 주의사항 안내 테이블 (row row-3) -->
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
                                      <p><strong>* 인증코드가 보이지 않는다면 다시 시도해주세요.</strong></p>
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
              <!-- 빈 공간 테이블 (row row-4) -->
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
              <!-- 인증코드 테이블 (row row-5) -->
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
                                    <strong><p style="font-size: 20px;">${verificationCode}</p></strong>
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
              <!-- 빈 공간 테이블 (row row-6) -->
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
              <!-- 안내 문구 테이블 (row row-7) -->
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
                                      <strong>📌 슬랙 채널로 돌아가 상단의 6자리 인증코드를 입력해주세요.</strong>
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
              <!-- 구분선 테이블 (row row-8) -->
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
              <!-- 안내사항 테이블 (row row-9) -->
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
                                            href="https://lottery.jh8459.com/support"
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
              <!-- 소셜 & 테이블 (row row-10) -->
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
