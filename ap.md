# Deploy gh-pages for Next.js

The web folder is "out".

## 1 Add “out” folder to your Git repository.

git add out/
git commit -m "Commit out for my gh-pages branch"

## 2 push out on your master branch

git push

## 3 push out as a subtree into your gh-pages branch

git subtree push --prefix out origin gh-pages

## 4 Add a deploy script in your package.json

"scripts": {
    "dev": "next",
    …
    "deploy": "next build && next export && git add out/ && git commit -m \"Deploy gh-pages\" && git subtree push --prefix out origin gh-pages"
},
