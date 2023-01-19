import type { NextApiRequest, NextApiResponse } from 'next'
const cheerio = require('cheerio');

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { cookie },
    method,
  } = _req

  const fetchCall = async () => {
    const url = `https://sungsan.silverhug.co.kr/cpcenter/live/live_list.php`;
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie: `PHPSESSID=${cookie}`,
      },
    })
    .then(async res => {
      return await res.text().then(res => res)
    })
    return result
  }

  fetchCall().then(data => {
    const $ = cheerio.load(data);
    let list = []
    $('#second-tab > table > tbody > tr').map((i, element) => {
      let tr = { 대상: '', 분야: '', 프로그램명: '', 강사명: ''};
      tr.대상 = String($(element).find('td:nth-child(1) > p').text())
      tr.분야 = String($(element).find('td:nth-of-type(2)').text())
      tr.프로그램명 = String($(element).find('td:nth-of-type(3) > p > span').text())
      tr.강사명 = String($(element).find('td:nth-of-type(4)').text())
      return list.push(tr)
    })
    res.status(200).json(list)
  })
}