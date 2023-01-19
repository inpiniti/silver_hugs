import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, pw, cookie },
    method,
  } = _req

  const fetchCall = async () => {
    const url = `https://sungsan.silverhug.co.kr/cpcenter/member/login_proc.php?user_id=${id}&user_pass=${pw}&qry=in&s_url`;
    const result = await fetch(url, {
      method: 'POST',
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
    res.status(200).json(data)
  })
}