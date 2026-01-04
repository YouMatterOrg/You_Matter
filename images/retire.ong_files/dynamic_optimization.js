let saDyoHeaderInsertionCount = 0;
let saDyoHeaderTitleTagCount = 0;
let saDyoHeaderMetaTagCount = 0;
let saDyoBodyHtmlTopInsertionCount = 0;
let saDyoBodyHtmlBottomInsertionCount = 0;
let saDyoLinksUpdationCount = 0;
let saDyoImagesAltsUpdationCount = 0;
let saDyoFooterHtmlInsertionCount = 0;

const SA_BASE_API_ROUTE_PROD = 'https://sa.searchatlas.com/api/v2';
const SA_BASE_API_ROUTE_STAGING = 'https://sa.staging.searchatlas.com/api/v2';
const saDyoHeadersUpdationCount = {h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0};
const saDyoUrlParams = new URLSearchParams(window.location.search);
const saDyoDiagnosticsExist = saDyoUrlParams.has('diagnostics');

const saDyoApiRoute = () => {
  return document.getElementById('sa-dynamic-optimization')?.getAttribute('src') === 'https://dashboard.staging.searchatlas.com/scripts/dynamic_optimization.js' ||
    document.getElementById('sa-dynamic-optimization-loader')?.getAttribute('src') === 'https://dashboard.staging.searchatlas.com/scripts/dynamic_optimization.js' ?
    SA_BASE_API_ROUTE_STAGING : SA_BASE_API_ROUTE_PROD;
};

const consolePrint = strData => {
  if (saDyoDiagnosticsExist) {
    console.debug(strData);
  }
};

const fetchData = async (pageUrl, uuid) => {
  let saDyoApiUrl = `${saDyoApiRoute()}/otto-url-details/?url=${encodeURIComponent(pageUrl)}`;
  if (uuid) saDyoApiUrl += `&uuid=${uuid}`;

  try {
    const saDyoResponse = await fetch(saDyoApiUrl);
    if (!saDyoResponse.ok) {
      consolePrint('API call failed.');
      return;
    }
    const saDyoPageData = await saDyoResponse.json();
    window.otto_js_pageData = saDyoPageData;
    consolePrint(`API response: ${saDyoPageData}`);
    if ((window.location.origin + window.location.pathname) === pageUrl) applyPageData(saDyoPageData);
    return saDyoPageData;
  } catch (error) {
    consolePrint(`Fetch error: ${error}`);
  }
};

const postPageCrawlLogs = async (pageUrl, uuid, context) => {
  try {
    const saDyoUseragent = navigator.userAgent;
    if (saDyoUseragent.includes('bot')) {
      const saDyoApiUrl = `${saDyoApiRoute()}/otto-page-crawl-logs/`;
      const saDyoBodyData = {
        otto_uuid: uuid,
        url: pageUrl,
        user_agent: saDyoUseragent,
        context: context,
      };

      try {
        const saDyoResources = performance.getEntriesByType('resource');

        // 1. Average Page Response Time
        const saDyoTotalResponseTime = saDyoResources.reduce((sum, resource) => sum + (resource.responseEnd - resource.startTime), 0);
        const saDyoAverageResponseTime = (saDyoResources.length > 0) ? (saDyoTotalResponseTime / saDyoResources.length).toFixed(2) : null;

        // 2. Total Download Size
        const saDyoTotalDownloadSize = saDyoResources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
        const saDyoTotalDownloadSizeKB = (saDyoTotalDownloadSize / 1024).toFixed(2);

        if (saDyoAverageResponseTime) {
          saDyoBodyData.average_response_time = saDyoAverageResponseTime;
        }

        if (saDyoTotalDownloadSizeKB) {
          saDyoBodyData.total_download_size_kb = saDyoTotalDownloadSizeKB;
        }
      } catch (error) {
        consolePrint(`Resources error: ${error}`);
      }

      const saDyoResponse = await fetch(saDyoApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saDyoBodyData),
      });

      if (!saDyoResponse.ok) {
        consolePrint('API call failed.');
        return;
      }
      const pageData = await saDyoResponse.json();
      consolePrint(`API response: ${pageData}`);
    }
  } catch (error) {
    consolePrint(`Fetch error: ${error}`);
  }
};

const replaceMetaData = metaData => {
  // Add null/undefined check to prevent destructuring errors
  if (!metaData || typeof metaData !== 'object') {
    consolePrint('Invalid metaData provided to replaceMetaData');
    return;
  }

  let saDyoHeaderElementExist = false;
  const {type, name, property, recommended_value: recommendedValue} = metaData;
  const saDyoRecommendedValue = recommendedValue;

  if (type === 'title') {
    const saDyoTitles = document.querySelectorAll('title');
    if (saDyoTitles?.length) {
      saDyoTitles?.forEach(item => {
        if (!window?.next) item?.remove();
      });
    }
    saDyoHeaderElementExist = false;
  } else {
    const saDyoMetaSelector = `meta[name="${(name || property)?.trim()}"], meta[property="${(name || property)?.trim()}"]`;
    saDyoHeaderElementExist = document.querySelector(saDyoMetaSelector) || false;
  }

  if (saDyoHeaderElementExist) {
    consolePrint(`Header Meta - ${saDyoHeaderElementExist}`);
    if (type === 'title') {
      saDyoHeaderTitleTagCount++;
      consolePrint(`Replacing existing title content - ${saDyoRecommendedValue}`);
      saDyoHeaderElementExist.innerHTML = saDyoRecommendedValue;
    } else {
      consolePrint(`Replacing existing Meta content - ${saDyoRecommendedValue}`);
      saDyoHeaderMetaTagCount++;
      saDyoHeaderElementExist.setAttribute('content', saDyoRecommendedValue);
    }
  } else {
    if (type === 'title') {
      consolePrint(`Header Title Not Found - ${type}`);
      saDyoHeaderTitleTagCount++;
      if (window?.next) {
        const saDyoTitle = document.querySelector('title');
        saDyoTitle.innerHTML = saDyoRecommendedValue;
      } else {
        const saDyoTitleTag = `<title>${saDyoRecommendedValue}</title>`;
        consolePrint(`Inserting Title tag element: ${saDyoTitleTag}`);
        document.head.insertAdjacentHTML('afterbegin', saDyoTitleTag);
      }
    } else {
      consolePrint(`Header Meta Not Found - ${type}`);
      const saDyoMetaAttribute = property ? 'property' : 'name';
      const saDyoMetaTag = `<meta ${saDyoMetaAttribute}="${property ? property : name}" content="${saDyoRecommendedValue}">`;
      saDyoHeaderMetaTagCount++;
      consolePrint(`Inserting tag element: ${saDyoMetaTag}`);
      document.head.insertAdjacentHTML('afterbegin', saDyoMetaTag);
    }
  }
};

const addAltTextToImages = images => {
  const saDyoAllImgsElements = document.querySelectorAll(`img`);
  saDyoAllImgsElements?.forEach(imgElement => {
    images?.forEach(([imageUrl, altText]) => {
      Array.from(imgElement?.attributes).forEach(attribute => {
        if (attribute.value === imageUrl) {
          saDyoImagesAltsUpdationCount++;
          consolePrint(`Adding/updating alt text for ${imgElement} with: ${altText}`);
          imgElement.alt = altText;
        }
      });
    });
  });
  consolePrint(`Total alt texts updated: ${saDyoImagesAltsUpdationCount}`);
};

let intervalID;

// Enhanced function to remove all dynamic optimization content for SPAs
const removeDynamicOptimizationContent = () => {
  try {
    // Remove elements with data attributes, but skip protected ones
    const saDyoElementsToRemove = document.querySelectorAll('[data-otto-pixel="dynamic-seo"],[data-otto-pixel="searchatlas"]');
    saDyoElementsToRemove.forEach(element => {
      // Don't remove if it's inside a protected container
      if (!element.closest('[data-sa-protected="true"]')) {
        element.remove();
      }
    });

    // Remove diagnostic comments for SPAs
    if (typeof saDyoDiagnosticsExist !== 'undefined' && saDyoDiagnosticsExist) {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_COMMENT,
        {
          acceptNode: function(node) {
            return node.nodeValue &&
              (node.nodeValue.includes('Dynamic Optimization') ||
               node.nodeValue.includes('SearchAtlas')) ?
              NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          },
        },
      );

      const commentsToRemove = [];
      let node;
      while (node = walker.nextNode()) {
        commentsToRemove.push(node);
      }
      commentsToRemove.forEach(comment => {
        // Don't remove comments inside protected containers
        if (comment.parentElement && !comment.parentElement.closest('[data-sa-protected="true"]')) {
          comment.remove();
        }
      });
    }

    // Reset counters for fresh start - only if variables exist
    if (typeof saDyoHeaderInsertionCount !== 'undefined') saDyoHeaderInsertionCount = 0;
    if (typeof saDyoHeaderTitleTagCount !== 'undefined') saDyoHeaderTitleTagCount = 0;
    if (typeof saDyoHeaderMetaTagCount !== 'undefined') saDyoHeaderMetaTagCount = 0;
    if (typeof saDyoBodyHtmlTopInsertionCount !== 'undefined') saDyoBodyHtmlTopInsertionCount = 0;
    if (typeof saDyoBodyHtmlBottomInsertionCount !== 'undefined') saDyoBodyHtmlBottomInsertionCount = 0;
    if (typeof saDyoLinksUpdationCount !== 'undefined') saDyoLinksUpdationCount = 0;
    if (typeof saDyoImagesAltsUpdationCount !== 'undefined') saDyoImagesAltsUpdationCount = 0;
    if (typeof saDyoFooterHtmlInsertionCount !== 'undefined') saDyoFooterHtmlInsertionCount = 0;
    if (typeof saDyoHeadersUpdationCount !== 'undefined' && saDyoHeadersUpdationCount) {
      Object.keys(saDyoHeadersUpdationCount).forEach(key => {
        saDyoHeadersUpdationCount[key] = 0;
      });
    }
  } catch (error) {
    if (typeof consolePrint === 'function') {
      consolePrint(`Error removing dynamic optimization content: ${error}`);
    } else {
      console.warn(`Error removing dynamic optimization content: ${error}`);
    }
  }
};

// Detect SPA framework for better compatibility
const detectSPAFramework = () => {
  if (typeof window === 'undefined') return 'unknown';

  // Next.js detection
  if (window?.next || window?.__NEXT_DATA__) return 'nextjs';

  // Angular detection
  if (window?.ng || document.querySelector('[ng-app], [data-ng-app], [ng-controller]') || window?.angular) return 'angular';

  // Vue detection
  if (window?.Vue || document.querySelector('[v-app], [data-v-app]') || window?.__VUE__) return 'vue';

  // React detection (vanilla React apps)
  if (window?.React || document.querySelector('#root, #app, [data-reactroot]')) return 'react';

  // Nuxt.js detection
  if (window?.$nuxt || window?.__NUXT__) return 'nuxt';

  return 'unknown';
};

const applyPageData = saDyoPageData => {
  // Handle null/undefined data gracefully
  if (!saDyoPageData || typeof saDyoPageData !== 'object') {
    if (typeof consolePrint === 'function') {
      consolePrint('No valid page data provided to applyPageData');
    }
    return;
  }

  // Remove any existing dynamic optimization content to prevent duplicates
  removeDynamicOptimizationContent();

  const framework = detectSPAFramework();
  if (typeof consolePrint === 'function') {
    consolePrint(`Detected SPA framework: ${framework}`);
  }

  // Handle header HTML insertion
  if (typeof consolePrint === 'function') {
    consolePrint(`Header HTML insertion started: ${saDyoPageData.header_html_insertion}`);
  }
  const saDyoHtmlToInject = saDyoPageData.header_html_insertion ?
    `${(typeof saDyoDiagnosticsExist !== 'undefined' && saDyoDiagnosticsExist) ?
      '<!-- Dynamic Optimization Header Integration Start -->' : ''}${saDyoPageData.header_html_insertion}${
      (typeof saDyoDiagnosticsExist !== 'undefined' && saDyoDiagnosticsExist) ?
        '<!-- Dynamic Optimization Header Integration Ended -->' : ''}` : '';
  if (saDyoHtmlToInject) {
    document.head.insertAdjacentHTML('afterbegin', saDyoHtmlToInject);
    if (typeof saDyoHeaderInsertionCount !== 'undefined') {
      saDyoHeaderInsertionCount++;
    }
  }
  if (typeof consolePrint === 'function') {
    consolePrint(`Header HTML insertion ended: ${saDyoHtmlToInject}`);
  }

  try {
    if (typeof consolePrint === 'function') {
      consolePrint(`Header replacements started: ${saDyoPageData.header_replacements}`);
    }
    if (Array.isArray(saDyoPageData.header_replacements)) {
      saDyoPageData.header_replacements?.forEach(data => {
        replaceMetaData(data);
      });
    }
    if (typeof consolePrint === 'function') {
      consolePrint(`Header replacements ended: ${saDyoPageData.header_replacements}`);
    }
  } catch (error) {
    if (typeof consolePrint === 'function') {
      consolePrint(`Header replacements Error: ${error}`);
    }
  }

  const saDyoBodyElement = document.querySelector('body');
  if (!saDyoBodyElement) {
    if (typeof consolePrint === 'function') {
      consolePrint('Warning: Body element not found');
    }
    return;
  }

  // Handle body top HTML insertion
  if (typeof consolePrint === 'function') {
    consolePrint(`Body top HTML insertion started: ${saDyoPageData.body_top_html_insertion}`);
  }
  const saDyoTopHtmlToInject = saDyoPageData.body_top_html_insertion ?
    `${(typeof saDyoDiagnosticsExist !== 'undefined' && saDyoDiagnosticsExist) ?
      '<!-- Dynamic Optimization Body Top Integration Start -->' : ''}${saDyoPageData.body_top_html_insertion}${
      (typeof saDyoDiagnosticsExist !== 'undefined' && saDyoDiagnosticsExist) ?
        '<!-- Dynamic Optimization Body Top Integration Ended -->' : ''} ` : '';
  if (saDyoTopHtmlToInject) {
    if (typeof saDyoBodyHtmlTopInsertionCount !== 'undefined') {
      saDyoBodyHtmlTopInsertionCount++;
    }
    saDyoBodyElement.insertAdjacentHTML('afterbegin', saDyoTopHtmlToInject);
  }
  if (typeof consolePrint === 'function') {
    consolePrint(`Body top HTML insertion ended: ${saDyoTopHtmlToInject}`);
  }

  // Handle body bottom HTML insertion
  if (typeof consolePrint === 'function') {
    consolePrint(`Body bottom HTML insertion started: ${saDyoPageData.body_bottom_html_insertion}`);
  }
  const saDyoBottomHtmlToInject = saDyoPageData.body_bottom_html_insertion ?
    `${(typeof saDyoDiagnosticsExist !== 'undefined' && saDyoDiagnosticsExist) ?
      '<!-- Dynamic Optimization Body Bottom Integration Start -->' : ''}${saDyoPageData.body_bottom_html_insertion}${
      (typeof saDyoDiagnosticsExist !== 'undefined' && saDyoDiagnosticsExist) ?
        '<!-- Dynamic Optimization Body Bottom Integration Ended -->' : ''} ` : '';
  if (saDyoBottomHtmlToInject) {
    if (typeof saDyoBodyHtmlBottomInsertionCount !== 'undefined') {
      saDyoBodyHtmlBottomInsertionCount++;
    }
    saDyoBodyElement.insertAdjacentHTML('beforeend', saDyoBottomHtmlToInject);
  }
  if (typeof consolePrint === 'function') {
    consolePrint(`Body bottom HTML insertion ended: ${saDyoBottomHtmlToInject}`);
  }

  // Handle body substitutions
  if (typeof consolePrint === 'function') {
    consolePrint('Body substitutions started');
  }
  if (saDyoPageData.body_substitutions && typeof saDyoPageData.body_substitutions === 'object') {
    for (const [saDyoBodySubstitutionsKey, saDyoData] of Object.entries(saDyoPageData.body_substitutions)) {
      if (saDyoBodySubstitutionsKey !== 'images') {
        if (typeof consolePrint === 'function') {
          consolePrint(`${saDyoBodySubstitutionsKey} - updating element value: ${saDyoData}`);
        }
        if (saDyoBodySubstitutionsKey === 'links') {
          const listData = Object.entries(saDyoData);
          listData.forEach(([oldUrl, newUrl]) => {
            try {
              const pathname = new URL(oldUrl).pathname;
              // Normalize URLs by removing trailing slashes for comparison
              const normalizeUrl = url => url?.replace(/\/$/, '');

              document.querySelectorAll('a[href]')?.forEach(element => {
                const elementHref = element.href;
                const elementHrefAttr = element.getAttribute('href');

                // Check if matches: full URL (with/without trailing slash) or pathname
                if (normalizeUrl(elementHref) === normalizeUrl(oldUrl) || elementHrefAttr === pathname) {
                  element.href = newUrl;
                  saDyoLinksUpdationCount++;
                }
              });
            } catch (e) {
              consolePrint(`Replacing Old Url: ${oldUrl} with New Url: ${newUrl} Failed`);
            }
          });
        } else if (saDyoBodySubstitutionsKey === 'headings') {
          saDyoData?.forEach(item => {
            document.querySelectorAll(item.type)?.forEach(element => {
              // Normalize text for comparison (remove extra whitespace, decode entities)
              const normalizeText = text => {
                return text.replace(/\s+/g, ' ').trim().replace(/&nbsp;/g, ' ');
              };

              const elementText = normalizeText(element.textContent);
              const targetText = normalizeText(item.current_value);

              if (elementText === targetText) {
                consolePrint(`${item.type} - heading - ${element.textContent} - Recommended heading - ${item.recommended_value}`);
                saDyoHeadersUpdationCount[item.type]++;

                // More precise text replacement that preserves HTML structure
                const replaceTextInNode = (node, oldText, newText) => {
                  if (node.nodeType === Node.TEXT_NODE) {
                    const nodeText = normalizeText(node.textContent);
                    if (nodeText.includes(normalizeText(oldText))) {
                      // Handle partial matches within text nodes
                      node.textContent = node.textContent.replace(oldText, newText);
                    }
                  } else {
                    // Recursively process child nodes
                    Array.from(node.childNodes).forEach(child => {
                      replaceTextInNode(child, oldText, newText);
                    });
                  }
                };

                // More robust text replacement for complex cases
                const replaceComplexText = (element, oldText, newText) => {
                  const walker = document.createTreeWalker(
                    element,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false,
                  );

                  const textNodes = [];
                  let node;
                  while (node = walker.nextNode()) {
                    textNodes.push(node);
                  }

                  // Combine all text content
                  const fullText = textNodes.map(n => n.textContent).join('');
                  const normalizedFullText = normalizeText(fullText);
                  const normalizedOldText = normalizeText(oldText);

                  if (normalizedFullText === normalizedOldText) {
                    // Clear all text nodes first
                    textNodes.forEach(textNode => {
                      textNode.textContent = '';
                    });

                    // Put the new text in the first text node
                    if (textNodes.length > 0) {
                      textNodes[0].textContent = newText;
                    }
                  } else if (normalizedFullText.includes(normalizedOldText)) {
                    // For partial matches, use the original logic
                    const replacedText = fullText.replace(oldText, newText);

                    // Distribute the new text back to text nodes
                    let currentIndex = 0;
                    textNodes.forEach(textNode => {
                      const nodeLength = textNode.textContent.length;
                      if (currentIndex < replacedText.length) {
                        const newNodeText = replacedText.substr(currentIndex, nodeLength);
                        textNode.textContent = newNodeText;
                        currentIndex += nodeLength;
                      } else {
                        textNode.textContent = '';
                      }
                    });
                  }
                };

                const targetElement = element;

                // If the element only contains text (no child elements), do simple replacement
                if (targetElement.children.length === 0) {
                  targetElement.textContent = targetElement.textContent.replace(item.current_value, item.recommended_value);
                } else {
                  // Try complex replacement for elements with child nodes
                  replaceComplexText(targetElement, item.current_value, item.recommended_value);

                  // If complex replacement didn't work, try the recursive approach
                  if (normalizeText(targetElement.textContent) === targetText) {
                    replaceTextInNode(targetElement, item.current_value, item.recommended_value);
                  }
                }
              }
            });
          });
        }
      }
    }
  }
  if (typeof consolePrint === 'function') {
    consolePrint('Body substitutions ended');
  }

  if (Array.isArray(saDyoPageData.header_replacements) && saDyoPageData.header_replacements?.length > 0) {
    const saDyoCanonicalLink = saDyoPageData.header_replacements.find(item=> item?.type == 'link' && item?.rel == 'canonical');
    const element = document.querySelector(`link[rel="canonical"]`);
    if (saDyoCanonicalLink && element) {
      element.href = saDyoCanonicalLink?.recommended_value;
    }
  }

  if (typeof consolePrint === 'function') {
    consolePrint('Intersection of missing alt tags started');
  }
  saDyoPageData?.body_substitutions?.images && addAltTextToImages(Object.entries(saDyoPageData?.body_substitutions?.images));
  if (typeof consolePrint === 'function') {
    consolePrint('Intersection of missing alt tags ended');
  }

  if (typeof consolePrint === 'function') {
    consolePrint(`Footer HTML insertion started: ${saDyoPageData.footer_html_insertion}`);
  }
  if (saDyoPageData.footer_html_insertion) {
    let saDyoFooterElement = document.querySelector('footer');
    if (!saDyoFooterElement) {
      if (typeof consolePrint === 'function') {
        consolePrint('Footer element not found');
      }
      saDyoFooterElement = document.createElement('footer');
      document.body.appendChild(saDyoFooterElement);
      if (typeof consolePrint === 'function') {
        consolePrint('Footer element added to footer');
      }
    }

    // Wrap footer content with protected attribute to prevent React removal
    const saDyoFooterHtmlToInject = saDyoPageData.footer_html_insertion ?
      `<div data-sa-protected="true">${(typeof saDyoDiagnosticsExist !== 'undefined' && saDyoDiagnosticsExist) ?
        '<!-- Dynamic Optimization Footer Integration Start -->' : ''}${saDyoPageData.footer_html_insertion}${
        (typeof saDyoDiagnosticsExist !== 'undefined' && saDyoDiagnosticsExist) ?
          '<!-- Dynamic Optimization Footer Integration Ended -->' : ''}</div>` : '';
    if (typeof saDyoFooterHtmlInsertionCount !== 'undefined') {
      saDyoFooterHtmlInsertionCount++;
    }
    saDyoFooterElement.insertAdjacentHTML('beforeend', saDyoFooterHtmlToInject);
    if (typeof consolePrint === 'function') {
      consolePrint(`Footer HTML inserted with protection: ${saDyoFooterHtmlToInject}`);
    }
  }
  if (typeof consolePrint === 'function') {
    consolePrint(`Footer HTML insertion ended: ${saDyoPageData.footer_html_insertion}`);
  }

  if (typeof consolePrint === 'function') {
    consolePrint('*************************************************************');
    consolePrint('******************** Diagnostics Summary ********************');
    consolePrint(`Header Insertions: ${saDyoHeaderInsertionCount}`);
    consolePrint(`Header Title Updated: ${saDyoHeaderTitleTagCount}`);
    consolePrint(`Body Top HTML Insertions: ${saDyoBodyHtmlTopInsertionCount}`);
    consolePrint(`Body Bottom HTML Insertions: ${saDyoBodyHtmlBottomInsertionCount}`);
    consolePrint(`Footer HTML Insertions: ${saDyoFooterHtmlInsertionCount}`);

    consolePrint(`Header Meta Tag Updated: ${saDyoHeaderMetaTagCount} out of ${Array.isArray(saDyoPageData.header_replacements) ? saDyoPageData.header_replacements?.filter(item => item.type != 'title')?.length : 0}`);
    consolePrint(`Image Alt Replacements: ${saDyoImagesAltsUpdationCount} out of ${(saDyoPageData.body_substitutions && 'images' in saDyoPageData.body_substitutions) ? Object.keys(saDyoPageData.body_substitutions?.images)?.length : 0}`);
    consolePrint(`Link Replacements: ${saDyoLinksUpdationCount} out of ${(saDyoPageData.body_substitutions && 'links' in saDyoPageData.body_substitutions) ? Object.keys(saDyoPageData.body_substitutions?.links)?.length : 0}`);
    Object.entries(saDyoHeadersUpdationCount).forEach(value => {
      consolePrint(`${value[0]} headings replaced - ${value[1]}`);
    });
    consolePrint('*************************************************************');
    consolePrint('*************************************************************');
  }
};

const intervalFunctionToRendermetaData = saDyoPageData => {
  intervalID = setInterval(() => {
    if (Array.isArray(saDyoPageData.header_replacements)) {
      saDyoPageData.header_replacements?.forEach(data => {
        replaceMetaData(data);
      });
    }
  }, 3000);
};

const initializeScript = async () => {
  consolePrint('Script initialization');
  const saDyoUuid = document.getElementById('sa-otto')?.getAttribute('data-uuid') || document.getElementById('searchatlas')?.getAttribute('data-uuid') || document.getElementById('sa-dynamic-optimization')?.getAttribute('data-uuid');
  consolePrint(`UUID: ${saDyoUuid}`);
  try {
    const saDyoPushState = history.pushState;
    history.pushState = function() {
      // eslint-disable-next-line prefer-rest-params
      saDyoPushState.apply(history, arguments);
      window.dispatchEvent(new Event('locationchange'));
    };
    window.onpopstate = function() {
      window.dispatchEvent(new Event('locationchange'));
    };
    window.addEventListener('locationchange', async () => {
      removeDynamicOptimizationContent();
      clearInterval(intervalID);
      const saDyoPageData = await fetchData(window.location.origin + window.location.pathname, saDyoUuid);
      if (saDyoPageData) {
        window.addEventListener('load', () => {
          postPageCrawlLogs(window.location.href, saDyoUuid, null);
        });
        intervalFunctionToRendermetaData(saDyoPageData);
        setTimeout(() => {
          clearInterval(intervalID);
        }, 30000);
      }
    });
  } catch (error) {
    consolePrint(`Routing issue: ${error}`);
  }

  window.addEventListener('load', () => {
    postPageCrawlLogs(window.location.href, saDyoUuid, null);
  });
  const saDyoPageData = await fetchData(window.location.origin + window.location.pathname, saDyoUuid);
  if (saDyoPageData) {
    intervalFunctionToRendermetaData(saDyoPageData);
    setTimeout(() => {
      clearInterval(intervalID);
    }, 30000);

    window.otto_js_installed = true;
    window.otto_js_uuid = saDyoUuid;
  }
  consolePrint('Script ended');
};

initializeScript();

// Mutation observer with proper reconnection and debouncing
let isApplyingPageData = false;
let mutationDebounceTimeout = null;
const MUTATION_DEBOUNCE_DELAY = 2000; // ms

/**
 * Checks if the current DOM state matches our applied changes
 * @param {Object} saDyoPageData - The page data with expected values
 * @return {boolean} true if DOM matches our changes, false otherwise
 */
const doesDOMMatchOurChanges = saDyoPageData => {
  if (!saDyoPageData || typeof saDyoPageData !== 'object') {
    return false;
  }

  try {
    // Check header replacements (meta tags and title)
    if (Array.isArray(saDyoPageData.header_replacements)) {
      for (const metaData of saDyoPageData.header_replacements) {
        if (!metaData || typeof metaData !== 'object') continue;

        const {type, name, property, recommended_value: recommendedValue} = metaData;

        if (type === 'title') {
          const titleElement = document.querySelector('title');
          if (titleElement && titleElement.textContent !== recommendedValue) {
            consolePrint(`Title mismatch: expected "${recommendedValue}", found "${titleElement.textContent}"`);
            return false;
          }
        } else {
          const metaSelector = `meta[name="${(name || property)?.trim()}"], meta[property="${(name || property)?.trim()}"]`;
          const metaElement = document.querySelector(metaSelector);
          if (metaElement && metaElement.getAttribute('content') !== recommendedValue) {
            consolePrint(`Meta mismatch: expected "${recommendedValue}", found "${metaElement.getAttribute('content')}"`);
            return false;
          }
        }
      }
    }

    // Check canonical link
    if (Array.isArray(saDyoPageData.header_replacements)) {
      const canonicalLink = saDyoPageData.header_replacements.find(item => item?.type === 'link' && item?.rel === 'canonical');
      if (canonicalLink) {
        const canonicalElement = document.querySelector('link[rel="canonical"]');
        if (canonicalElement && canonicalElement.href !== canonicalLink.recommended_value) {
          consolePrint(`Canonical mismatch: expected "${canonicalLink.recommended_value}", found "${canonicalElement.href}"`);
          return false;
        }
      }
    }

    // Check headings
    if (saDyoPageData.body_substitutions && saDyoPageData.body_substitutions.headings) {
      const normalizeText = text => text.replace(/\s+/g, ' ').trim().replace(/&nbsp;/g, ' ');

      for (const headingItem of saDyoPageData.body_substitutions.headings) {
        const headingElements = document.querySelectorAll(headingItem.type);
        let foundMatch = false;

        for (const element of headingElements) {
          const elementText = normalizeText(element.textContent);
          const targetText = normalizeText(headingItem.current_value);
          const expectedText = normalizeText(headingItem.recommended_value);

          if (elementText === targetText || elementText === expectedText) {
            // If it matches current_value, it needs updating
            if (elementText === targetText) {
              consolePrint(`Heading needs update: ${headingItem.type} with text "${elementText}"`);
              return false;
            }
            // If it matches recommended_value, it's already updated
            foundMatch = true;
          }
        }

        // If we expected to find a heading with current_value but all match recommended_value, that's fine
        // But if we can't find any matching heading at all, something might be wrong
        if (!foundMatch && headingElements.length > 0) {
          // Check if any heading has the recommended value
          let hasRecommendedValue = false;
          for (const element of headingElements) {
            if (normalizeText(element.textContent) === normalizeText(headingItem.recommended_value)) {
              hasRecommendedValue = true;
              break;
            }
          }
          if (!hasRecommendedValue) {
            consolePrint(`Heading not found or not updated: ${headingItem.type}`);
            return false;
          }
        }
      }
    }

    // Check links
    if (saDyoPageData.body_substitutions && saDyoPageData.body_substitutions.links) {
      const normalizeUrl = url => url?.replace(/\/$/, '');

      for (const [oldUrl, newUrl] of Object.entries(saDyoPageData.body_substitutions.links)) {
        try {
          const pathname = new URL(oldUrl).pathname;
          const links = document.querySelectorAll('a[href]');
          let foundMismatch = false;

          for (const link of links) {
            const linkHref = link.href;
            const linkHrefAttr = link.getAttribute('href');

            // If this link matches the old URL, it should have been updated to newUrl
            if (normalizeUrl(linkHref) === normalizeUrl(oldUrl) || linkHrefAttr === pathname) {
              if (normalizeUrl(linkHref) !== normalizeUrl(newUrl) && linkHrefAttr !== newUrl) {
                consolePrint(`Link mismatch: expected "${newUrl}", found "${linkHref}"`);
                foundMismatch = true;
                break;
              }
            }
          }

          if (foundMismatch) {
            return false;
          }
        } catch (e) {
          consolePrint(`Error checking link: ${oldUrl}`);
        }
      }
    }

    // Check image alt texts
    if (saDyoPageData.body_substitutions && saDyoPageData.body_substitutions.images) {
      const images = document.querySelectorAll('img');

      for (const [imageUrl, expectedAltText] of Object.entries(saDyoPageData.body_substitutions.images)) {
        let foundMismatch = false;

        for (const img of images) {
          // Check if this image matches the URL
          let matchesUrl = false;
          for (const attr of Array.from(img.attributes)) {
            if (attr.value === imageUrl) {
              matchesUrl = true;
              break;
            }
          }

          if (matchesUrl && img.alt !== expectedAltText) {
            consolePrint(`Image alt mismatch: expected "${expectedAltText}", found "${img.alt}"`);
            foundMismatch = true;
            break;
          }
        }

        if (foundMismatch) {
          return false;
        }
      }
    }

    // Check if our inserted HTML elements are present (header, body top/bottom, footer)
    // We check for elements with data-otto-pixel attribute or diagnostic comments
    if (saDyoPageData.header_html_insertion) {
      const hasHeaderInsertion = document.head.innerHTML.includes(saDyoPageData.header_html_insertion) ||
        document.querySelector('[data-otto-pixel="dynamic-seo"]') ||
        (saDyoDiagnosticsExist && document.head.innerHTML.includes('Dynamic Optimization Header Integration'));
      if (!hasHeaderInsertion) {
        consolePrint('Header HTML insertion not found');
        return false;
      }
    }

    if (saDyoPageData.body_top_html_insertion) {
      const hasBodyTopInsertion = document.body.innerHTML.includes(saDyoPageData.body_top_html_insertion) ||
        (saDyoDiagnosticsExist && document.body.innerHTML.includes('Dynamic Optimization Body Top Integration'));
      if (!hasBodyTopInsertion) {
        consolePrint('Body top HTML insertion not found');
        return false;
      }
    }

    if (saDyoPageData.body_bottom_html_insertion) {
      const hasBodyBottomInsertion = document.body.innerHTML.includes(saDyoPageData.body_bottom_html_insertion) ||
        (saDyoDiagnosticsExist && document.body.innerHTML.includes('Dynamic Optimization Body Bottom Integration'));
      if (!hasBodyBottomInsertion) {
        consolePrint('Body bottom HTML insertion not found');
        return false;
      }
    }

    if (saDyoPageData.footer_html_insertion) {
      const footer = document.querySelector('footer');
      const hasFooterInsertion = footer && (
        footer.innerHTML.includes(saDyoPageData.footer_html_insertion) ||
        (saDyoDiagnosticsExist && footer.innerHTML.includes('Dynamic Optimization Footer Integration'))
      );
      if (!hasFooterInsertion) {
        consolePrint('Footer HTML insertion not found');
        return false;
      }
    }

    // All checks passed - DOM matches our changes
    consolePrint('DOM matches our applied changes - skipping re-application');
    return true;
  } catch (error) {
    consolePrint(`Error checking DOM state: ${error}`);
    return false;
  }
};

const handleDOMChanges = () => {
  // Prevent infinite loops from our own DOM changes
  if (isApplyingPageData) {
    return;
  }

  // Clear any existing debounce timeout
  if (mutationDebounceTimeout) {
    clearTimeout(mutationDebounceTimeout);
    mutationDebounceTimeout = null;
  }

  // Debounce the application to avoid excessive re-applications
  mutationDebounceTimeout = setTimeout(() => {
    if (window.otto_js_pageData) {
      // Check if DOM already matches our changes
      if (doesDOMMatchOurChanges(window.otto_js_pageData)) {
        consolePrint('DOM already matches our changes - no action needed');
        if (mutationDebounceTimeout) {
          clearTimeout(mutationDebounceTimeout);
          mutationDebounceTimeout = null;
        }
        return;
      }

      consolePrint('DOM Changed - Applying page data');

      isApplyingPageData = true;

      try {
        applyPageData(window.otto_js_pageData);
      } catch (error) {
        consolePrint(`Error applying page data: ${error}`);
      } finally {
        isApplyingPageData = false;
      }
    }
  }, MUTATION_DEBOUNCE_DELAY);
};

const observer = new MutationObserver(mutations => {
  // Filter out mutations that are likely from our own changes
  const relevantMutations = mutations.filter(mutation => {
    // Skip mutations on elements we've added
    if (mutation.target.hasAttribute && mutation.target.hasAttribute('data-otto-pixel')) {
      return false;
    }

    // Skip mutations in head section if they're our meta tags
    if (mutation.target === document.head || mutation.target.parentElement === document.head) {
      return false;
    }

    return true;
  });

  // Only handle DOM changes if there are relevant mutations
  if (relevantMutations.length > 0) {
    handleDOMChanges();
  }
});

// Start observing DOM changes
observer.observe(document.body, {
  childList: true,
  attributes: true,
  subtree: true,
  characterData: true,
});
