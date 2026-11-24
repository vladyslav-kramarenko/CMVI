# CMVI — web migration

This branch preserves the 2017 Java source and adds a standalone, dependency-free browser port in `web/`.

## Local preview

```sh
python3 -m http.server 8080 --directory web
```

Open http://localhost:8080. No backend or secrets are needed.

## Cloudflare

Deploy from this branch with the root Wrangler configuration: `npx wrangler deploy`. Configure a development domain before adding a production route. No custom domain is configured here.

For Git-connected Workers Builds, select `web` as the production branch in the Worker's build settings (this is the development Worker for now). Use repository root `/`, leave the build command empty, and set the deploy command to `npx wrangler deploy`. The legacy `master` branch does not contain the web assets or Wrangler configuration.

## Scope

Implemented: Gaussian elimination, Jacobi, Gauss–Seidel, determinant, inverse matrix, Newton, fixed-point iteration, Lagrange interpolation, trapezoidal and Simpson integration, and finite-difference sweep for linear second-order boundary-value problems. Krylov uses an orthonormal restarted Krylov (Arnoldi) basis, Hessenberg characteristic polynomial recurrence, shifted complex QR eigenvalues and verified eigenvectors for matrices up to 10 × 10. Repeated and close eigenvalues can be ill-conditioned; multiplicities are numerical estimates. The web methods use independent JavaScript implementations of the same mathematical algorithms, not a line-by-line Java translation. Newton accepts an optional supplied derivative (otherwise a central difference) and uses separate absolute-step and residual tolerances. Fixed-point iteration includes a local derivative diagnostic, not a certified contraction bound. Trapezoidal and Simpson rules offer fixed or adaptive grids with conditional Runge error estimates. Sweep uses first-order Robin boundary discretization. Legacy file import and parity with the original Java examples remain to be completed. JSON result export, on-page solution reports, self-contained HTML report export and browser print/PDF are available. Reports include row operations, iteration histories, quadrature nodes, Lagrange terms and expanded coefficients, sweep tables and Krylov basis, characteristic polynomial, eigenvalues and verified eigenvectors. Large problems can produce long reports. Expressions use an explicit parser, not eval.

## Validation

The numerical engine was smoke-tested on known examples for all implemented method categories. Browser UI, edge cases, and original Java parity still need testing.

Run the Krylov numerical regression suite: `node --test tests/krylov.test.cjs`.

Root and quadrature regression tests: `node --test tests/root-integration.test.cjs`.

All 12 methods include theory and data-dependent applicability diagnostics. Sufficient convergence conditions, numerical diagnostics, and hard requirements are distinguished. Sampling cannot certify smoothness or absence of singularities. Run `node --test tests/applicability.test.cjs` for the diagnostic regression suite.

Method visualization: matrix transformation playback, 2D linear-system geometry, determinant/inverse area transformations, iteration residuals and trajectories, Lagrange basis curves, quadrature refinement, finite-difference mesh and sweep pivots, and complex eigenvalue plots. Visuals use actual calculation data and are included in HTML/print reports; higher-dimensional systems use matrix/iteration views. Run `node --test tests/visualization.test.cjs`.

## Multilingual static site

The site contains 65 static pages (five languages, 12 calculator routes plus a catalog per language). English uses unprefixed URLs; other languages use /ru/, /fr/, /uk/, /de/. The URL fixes the language and the switcher links to the matching translated page. The mathematical engine and styles remain shared. Production canonical URLs and sitemap use https://cmvi.kramarenko.info; configure the domain before submitting the sitemap. Regenerate after content changes with `node scripts/build-site.cjs`; generated pages are committed so the existing Cloudflare build configuration does not change. Run `node --test tests/site.test.cjs` to validate routes and metadata.

Language navigation preserves current calculator inputs in tab-scoped session storage when available and recomputes unchanged previously solved input. Direct links remain language-specific; there is no forced language redirect.
