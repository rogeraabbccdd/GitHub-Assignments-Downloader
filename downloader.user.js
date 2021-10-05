// ==UserScript==
// @name         GitHub Classroom Assignments Downloader
// @version      1.1
// @description  Add some buttons to download assignment zip in GitHub classroom
// @author       rogeraabbccdd
// @match        https://classroom.github.com/*
// @namespace    https://github.com/rogeraabbccdd/GitHub-Assignments-Downloader/
// @updateURL    https://raw.githubusercontent.com/rogeraabbccdd/GitHub-Assignments-Downloader/master/downloader.user.js
// @downloadURL  https://raw.githubusercontent.com/rogeraabbccdd/GitHub-Assignments-Downloader/master/downloader.user.js
// @grant        none
// ==/UserScript==

const downloadBtnHTML = (url) => `
<a href="${url}/archive/master.zip" class="btn btn-sm BtnGroup-item btn-primary">
  <svg class="octicon octicon-download mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16"
    aria-hidden="true">
    <path fill-rule="evenodd"
      d="M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75zM3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z">
    </path>
  </svg>
  Download ZIP
</a>
`

const downloadAllBtnHTML =
`
<li class="dropdown-divider" role="separator"></li>
<li>
  <a id="js-download-all-btn" class="dropdown-item ws-normal" href="#">
    <h5>
      <svg class="octicon octicon-repo" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
        <path fill-rule="evenodd"
          d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z">
        </path>
      </svg>
      Download repositories
    </h5>
    <p class="py-1 mb-0 text-small text-gray">Download all repos ZIP in this page.</p>
  </a>
</li>
`

const editDOM = async () => {
  const url = location.href

  const repos = []

  if (url.match(/classroom\.github\.com\/classrooms\/.*\/assignments\/.+/g)) {
    const timer = setInterval(() => {
      const loadings = document.querySelectorAll('#assignment-repo-list>include-fragment')
      if (loadings.length === 0) {
        clearInterval(timer)
        const BtnGroups = document.querySelectorAll('#assignment-repo-list>.assignment-repo-list-item>.BtnGroup')
        for (const BtnGroup of BtnGroups) {
          const url = BtnGroup.getElementsByTagName('a')[0].href
          repos.push(url)
          BtnGroup.insertAdjacentHTML('beforeend', downloadBtnHTML(url))
        }

        document.querySelector('summary.btn.btn-sm.btn-primary').nextElementSibling.querySelector('ul').insertAdjacentHTML('beforeend', downloadAllBtnHTML)

        const downloadAllBtn = document.getElementById('js-download-all-btn')
        downloadAllBtn.onclick = () => {
          let index = 0
          const downloadTimer = setInterval(() => {
            const a = document.createElement('a')
            a.href = repos[index] + '/archive/master.zip'
            a.download = ''
            a.target = '_blank'
            a.click()
            index++
            if (index === repos.length) {
              clearInterval(downloadTimer)
            }
          }, 300)
        }
      }
    }, 500)
  }
}

const observer = new MutationObserver(editDOM)

const container = document.documentElement || document.body
observer.observe(container, { attributes: true, childList: true, characterData: true })

editDOM()
