import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import YAML from "yaml";

const homeAssistantInputTag = {
  tag: "!input",
  collection: "scalar",
  resolve: (value) => value,
};

const files = globSync("**/*.{yaml,yml}", {
  exclude: ["node_modules/**"],
});

let failed = false;

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const doc = YAML.parseDocument(source, {
    customTags: [homeAssistantInputTag],
    keepSourceTokens: true,
    prettyErrors: true,
  });

  if (doc.errors.length > 0) {
    failed = true;
    console.error(`\n${file}`);
    for (const error of doc.errors) {
      console.error(`  ${error.message}`);
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log(`YAML OK (${files.length} file${files.length === 1 ? "" : "s"})`);
