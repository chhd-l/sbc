export function replaceLink(template, item) {
  if (template.indexOf("'tagging name'")>= 0) {
    template = template.replace("'tagging name'", item.segmentName);
  }
  if (template.indexOf("'template name'")>= 0) {
    template = template.replace("'template name'", item.templateName);
  }
  if (template.indexOf("'automation name'")>= 0) {
    template = template.replace("'automation name'", item.campaignName);
  }
  if (template.indexOf("'task name'")>= 0) {
    template = template.replace("'task name'", item.taskName);
  }
  if (template.indexOf("'/'note contents'") >= 0) {
    template = template.replace("'/'note contents'", item.contents);
  }

  return template;
}
