export function replaceLink(template, item) {
  if (template.indexOf("'segment name'")) {
    template = template.replace("'segment name'", item.segmentName);
  }
  if (template.indexOf("'template name'")) {
    template = template.replace("'template name'", item.templateName);
  }
  if (template.indexOf("'campaign name'")) {
    template = template.replace("'campaign name'", item.campaignName);
  }
  if (template.indexOf("'task name'")) {
    template = template.replace("'task name'", item.taskName);
  }

  return template;
}
