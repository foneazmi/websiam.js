import puppeteer from "puppeteer";

const label = [
  "NIM",
  "Nama",
  "Jenjang/Fakultas",
  "Jurusan",
  "Program Studi",
  "Seleksi",
  "Nomor Ujian",
];

export const login = async (nim, password) => {
  let data = {};
  let i = 0;
  //   const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://siam.ub.ac.id/", {
    waitUntil: "networkidle0",
  });
  await page.type("input[name=username]", nim);
  await page.type("input[name=password]", password);
  await page.click("input[name=login]");
  const page2 = await browser.newPage();
  await page2.goto("https://siam.ub.ac.id/biodata.php", {
    waitUntil: "domcontentloaded",
  });
  let url = page2.url();
  if (url === "https://siam.ub.ac.id/index.php") {
    await browser.close();
    return {
      status: false,
      message: "Login failed, please check your credentials and try again",
    };
  } else {
    console.log(url);
    const element = await page2.waitForXPath('//div[@class="bio-info"]');
    let value = await page2.evaluate((el) => el.textContent, element);
    value
      .replace("Jenjang/Fakultas", "")
      .replace("Jurusan", "")
      .replace("Program Studi", "")
      .replace("Seleksi", "")
      .replace("Nomor Ujian", "")
      .replace("PDDIKTI KEMDIKBUDDetail", "")
      .split("        ")
      .map((e) => {
        if (e.length) {
          data[label[i++]] = e.trim();
        }
      });
    await browser.close();
    return {
      status: true,
      message: "Login success!",
      data: data,
    };
  }
};
