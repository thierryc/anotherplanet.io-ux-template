# Deploy gh-pages for Next.js

## Step 1

Create out folder
Add empty file into the out folder.

## Step 2

git add out && git commit -m "Initial out subtree commit"

## Step 3

git subtree push --prefix out origin gh-pages


## Next Deploy Command

next build && next export && git add out/ && git commit -m \"Deploy gh-pages\" && git subtree push --prefix out origin gh-pages


next build && next export && 
