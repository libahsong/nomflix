import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  position: relative;
  color: grey;
  margin: 20px auto 0;
  max-width: 980px;
  padding: 0 4%;
`;
const SocialLinks = styled.div`
  /* z-index: 1; */
  display: flex;
  margin-bottom: 1em;
  a {
    margin-right: 15px;
    cursor: pointer;
    text-decoration: none;
    color: white;
    svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
  }
`;
const MemberLinks = styled.ul`
  /* z-index: 1; */

  /* align-items: flex-start; */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* flex-direction: row; */
  /* flex-wrap: wrap; */
  font-size: 13px;
  margin: 0 0 14px;
  padding: 0;
  li {
    flex-basis: 25%;
    box-sizing: border-box;
    flex: 0 0 50%;
    list-style-type: none;
    margin-bottom: 16px;
    padding-right: 22px;
  }
`;
const MemberService = styled.div`
  /* z-index: 1; */

  margin-bottom: 15px;
  button {
    background-color: transparent;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
`;
const Copylight = styled.div`
  /* z-index: 1; */

  font-size: 11px;
  margin-bottom: 15px;
  line-height: 1.4;
  div {
    margin-top: 3px;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <SocialLinks>
        <a href="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
          </svg>
        </a>
        <a href="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
          </svg>
        </a>
        <a href="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z" />
          </svg>
        </a>
        <a href="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
          </svg>
        </a>
      </SocialLinks>
      <MemberLinks>
        <li>
          <a>
            <span>화면 해설</span>
          </a>
        </li>
        <li>
          <a>
            <span>고객 센터</span>
          </a>
        </li>
        <li>
          <a>
            <span>기프트카드</span>
          </a>
        </li>
        <li>
          <a>
            <span>미디어 센터</span>
          </a>
        </li>
        <li>
          <a>
            <span>투자 정보(IR)</span>
          </a>
        </li>
        <li>
          <a>
            <span>입사 정보</span>
          </a>
        </li>
        <li>
          <a>
            <span>이용 약관</span>
          </a>
        </li>
        <li>
          <a>
            <span>개인 정보</span>
          </a>
        </li>
        <li>
          <a>
            <span>법적 고지</span>
          </a>
        </li>
        <li>
          <a>
            <span>쿠키 설정</span>
          </a>
        </li>
        <li>
          <a>
            <span>회사 정보</span>
          </a>
        </li>
        <li>
          <a>
            <span>문의하기</span>
          </a>
        </li>
      </MemberLinks>
      <MemberService>
        <button>서비스 코드</button>
      </MemberService>
      <Copylight>
        <div>○○○ 유한회사</div>
        <div>통신 판매 신고 번호:</div>
        <div>전화번호:</div>
        <div>대표 : ○○○</div>
        <div>이메일 주소: ○○○</div>
        <div>사업자 등록 번호:○○○</div>
        <div>클라우드 호스팅</div>
        <div>
          <a href="/">공정거래 위원회 웹사이트</a>
        </div>
      </Copylight>
    </FooterContainer>
  );
}

export default Footer;
