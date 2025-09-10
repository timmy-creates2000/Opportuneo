import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  posted: string
  description: string
  url: string
}

interface Lead {
  id: string
  name: string
  title: string
  company: string
  email: string
  website: string
  linkedin: string
  industry: string
}

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  country: string
}

interface SEOKeyword {
  keyword: string
  volume: number
  difficulty: string
  cpc: string
  competition: string
}

// Excel Export Functions
export const exportJobsToExcel = (jobs: Job[], filename = "jobs-export.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(
    jobs.map((job) => ({
      "Job Title": job.title,
      Company: job.company,
      Location: job.location,
      Type: job.type,
      Posted: job.posted,
      Description: job.description,
      URL: job.url,
    })),
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs")
  XLSX.writeFile(workbook, filename)
}

export const exportLeadsToExcel = (leads: Lead[], filename = "leads-export.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(
    leads.map((lead) => ({
      Name: lead.name,
      Title: lead.title,
      Company: lead.company,
      Email: lead.email,
      Website: lead.website,
      LinkedIn: lead.linkedin,
      Industry: lead.industry,
    })),
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads")
  XLSX.writeFile(workbook, filename)
}

export const exportNewsToExcel = (articles: NewsArticle[], filename = "news-export.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(
    articles.map((article) => ({
      Title: article.title,
      Description: article.description,
      Source: article.source,
      Published: article.publishedAt,
      Country: article.country,
      URL: article.url,
    })),
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "News")
  XLSX.writeFile(workbook, filename)
}

export const exportSEOToExcel = (keywords: SEOKeyword[], filename = "seo-keywords-export.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(
    keywords.map((kw) => ({
      Keyword: kw.keyword,
      "Search Volume": kw.volume,
      Difficulty: kw.difficulty,
      CPC: kw.cpc,
      Competition: kw.competition,
    })),
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "SEO Keywords")
  XLSX.writeFile(workbook, filename)
}

// PDF Export Functions
export const exportJobsToPDF = (jobs: Job[], filename = "jobs-export.pdf") => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text("Job Search Results", 20, 20)

  doc.setFontSize(12)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)
  doc.text(`Total Jobs: ${jobs.length}`, 20, 40)

  const tableData = jobs.map((job) => [job.title, job.company, job.location, job.type, job.posted])
  ;(doc as any).autoTable({
    head: [["Job Title", "Company", "Location", "Type", "Posted"]],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  })

  doc.save(filename)
}

export const exportLeadsToPDF = (leads: Lead[], filename = "leads-export.pdf") => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text("Lead Generation Results", 20, 20)

  doc.setFontSize(12)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)
  doc.text(`Total Leads: ${leads.length}`, 20, 40)

  const tableData = leads.map((lead) => [lead.name, lead.title, lead.company, lead.email, lead.industry])
  ;(doc as any).autoTable({
    head: [["Name", "Title", "Company", "Email", "Industry"]],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [34, 197, 94] },
  })

  doc.save(filename)
}

export const exportNewsToPDF = (articles: NewsArticle[], filename = "news-export.pdf") => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text("News Articles", 20, 20)

  doc.setFontSize(12)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)
  doc.text(`Total Articles: ${articles.length}`, 20, 40)

  const tableData = articles.map((article) => [
    article.title.substring(0, 40) + "...",
    article.source,
    article.publishedAt,
    article.country,
  ])
  ;(doc as any).autoTable({
    head: [["Title", "Source", "Published", "Country"]],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [168, 85, 247] },
  })

  doc.save(filename)
}

export const exportSEOToPDF = (keywords: SEOKeyword[], filename = "seo-keywords-export.pdf") => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text("SEO Keywords Analysis", 20, 20)

  doc.setFontSize(12)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)
  doc.text(`Total Keywords: ${keywords.length}`, 20, 40)

  const tableData = keywords.map((kw) => [kw.keyword, kw.volume.toString(), kw.difficulty, kw.cpc, kw.competition])
  ;(doc as any).autoTable({
    head: [["Keyword", "Volume", "Difficulty", "CPC", "Competition"]],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [245, 158, 11] },
  })

  doc.save(filename)
}
