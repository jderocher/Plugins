/*
 * 
 * VUEVENTS PUBLISH EVENT PLUGIN
 * Copyright 2011-2014, Vuevent Inc.
 * 
 * This plugin is used publish an event on Vuevent. This plugin is attached to 
 * a form element and the fields of the form are mapped to the fields of
 * the Vuevent event model. On submitting the form, the values from the 
 * form fields are extracted from the form and are posted to a Vuevent 
 * API endpoint. 
 * 
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function ( $, window, document, undefined ) {
    
    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.
    
    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in your plugin).
	
    // Create the defaults once
    var pluginName = 'vueventPublisher',
        defaults = {
    		baseURI: 'http://vuevents.com/',
    		authURL: 'http://vuevents.com/o/authorize/',
    		clientID: '',
			responseType: 'token',
            state: Math.random().toString(36).slice(2),
            scope: 'read write',
            redirectURI: '',
            buttonID: 'btnVueventPublishEvent',
            formID: '',
            fieldMap: {
            	title: {name: 'title', type: 'string'},
            	startTime: {name: 'start_time', type: 'datetime'},
            	endTime: {name: 'end_time', type: 'datetime'},
            	location: {name: 'location', type: 'string'},
            	extendedDescription: {name: 'extended_description', type: 'string'},
            	shortDescription:  {name: 'short_description', type: 'string'},
            },
            fields: {}
            
        },
        publishButtonCss = {
        	'height': '36px',
    		'width': '36px',
    		'border': '0px',
    		'background-image': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAO1NJREFUeAHtfQl8nUd177naZUnWZsmbbNny7jg2gSQ4cTayQdna0rD8SNMkbSEBSkiAtOVBeRBIKKSkBAqPNik8QskjlITEEEIMIY6zGrIvlmNZkuVFlm1ZsqzV2m7//zPf+e7cq3ula+vKTniM/d3Zzpw5c87MmTPzzTeKjI6ORiORiESjUfGdpiEhOjoqWVlZmkWI1v2dsm3HXqlv2iu/375PntzdKW29g2H5qEQAFo34uNIPT6ZsYi2ZxJWIe2rjZB6f4rwcOWVmiZy5uFpW1c2WpQtnS+2cKilAOh1kJ5RTMvkpAH4iFDAjBKKjoP0CDA+NjMozrzTJvRtflK8+1Syyo1uEMi/PEynMkbzsLCVIEfxRwI4Nk/ylUIYhi9EjIyJdgyJ98GcUyAffOEfed94qOefU5VI+vUhroaA5CBMHKTNVwCraQMBMtAIMv/DqTvnOTx+T//h5g8i0bJGqAqkryFH5dqNv9IwCHoRoL2GB14yAlZjX9U8WBFMAuZRmRwScl0PDo9J+6IhI24C88bSZ8oUPnCFvPWu15OVkB6OZo46SoESdRCKQOh0S3Cg24XLU3nn/E3LFrRtF8rJkycxp6FHoTEjvgwYeQZksPFDuHPZa3v1MRjVOpqxHggYziSsR9/GKg7sQ8Cge/iuA3KZDhsXQmFt7MKqbeuTaS1fJP175VplZMT2pyg4FTFVswj3U0y833v6A/MuPXpTaFWUSAdI9Q9D3+Ie+ItERqAu67ByJZudCXbN/qR6gT4lbhFBH4SZTNrGaZLjYEY+RtET0Ux4HrVC9MjoskZEhsBT8B59HIQwOtBkY1ZW5WbJlZ7csW1gmP/2HP5NVi2tCIRt5TkWrcDEioRMo3I/d/FO58zdNctLycmkZGBEoBeG0HkVFFGi0qEJGi8olmlcIIUPA7AEh35Ix1qqbyJ9M2Ylwvw7zqRlHIOChIxLp75KsnoMSGexTQUfB8yHkL8rPkW2dA4CLygtf/6CsXjovHKjUzHEjmGr5s/92n9z8k5fk5BXl8krfkOQBUWR0BIo4KiOls2S0dKZE86eBWxzPICBOPZOJkxHSZMqOESCIi3W7MbmvlwQMHE6EdJHhQQi5Q7I69iAMoWNwDWBkU8jbuzAMi/Jk582XybxZGICB4RVnRf9g/eNyxY2/kZNOrpD6/mHJp2WGHhTNyZORqjqMWqhrFSpUB9lHF45cF51yAVu9Vl1KP6OdJWUtxzUDmjYaycYo7pfs9h2S1dsZL+R9vXLpaTXy3X94rxQX5qtVDTvJLYte3LZLrvjWJpm/vExaYJpz5Kpw82BczV7hhMu5F6M8FC5bR4Yfzydtjh6rHZB2BccfEKsWnY9z82Vk1hJoVGjTkUEpwNTadGRYVs4ukh890Cg/efD3IW1YPkGXw/z+zt1PiGDSzoZgj4A3EQz9aE6+DM9cDCu6wCHmoOCj7mikGtY3QcBwTwCWXnZGkaVX5RRDUVtiFAumTLqRGbUyWlwl0eFhDMhs2XNkVGYsKZO/uWOz7Ght1/0MLpzk2fpm+fcHtsviWdNkN4SdAxw651YtcIYULDlFTGB1R8u7dDsDkacLOxFcJnFNVNdxzqegaVXDG5kx39lE0RHpARkVeVjRtA/I+o0vkAFYyuJn/aZXsKLOlhEUiahqHpGRkmoZLZyOkQvh0tGYmvRDPBPhmig/XTpGMWGlC2t0TdZPt74MwIFULqO4qhkpr2EMozgiB2FNy9wi+fyv66XtICzv1gOH5KbNLboN1oXRm03VjPXtaEnVWPtJ0UzmB5WrhMfDQZhMuHAuSQOZ0TVZP42qMgmCIRzByI1iII4WTMegHsbOYlQWY/u4q/GwvLJ9j+Q0tOwT2dUjCxeWyF6soKMoMIp1LuddzODAYBQxkC7zCefD+2HDl8ofr+zR4DH8RvOxlDUcr2EfzYtyA6S4QiIDh7ENFZFBNrkoRx55vllytja36YuDbAxvLIhgZKEAeoM6vofgpK7OGBVEJ/R8eD88YUEA+PCpwhPhSbSifTwTlX0d5XMVRFWdX6TL2SwYYPux0MmuLJDbn9kpWc82HRApydOXBjohR7D9mIvRm5TJZJIxKjFsTElMTwXvp/tl/bAP44d9mJThoAC9dMoeLYwPP1Vh4rWH7UwMI0nHH9IxrQpWPbQ7oujbuVg6tWMvI2vzni68JcqRbkidmxicfxWYBooVJu6QSanCfuWpYFKl+2X98NHCT6asX5ePxw/7MMcjzDrMkQ5zFjYfIxgC5YaUGpaUJLJodOW09g9JDt5OjFCYfPhyn2qZEHFCNeTp+FZxOrCJMJMp6+NKVNF+3h9YGCyLQMD60sfkqFMul0nkpwqUjbbcyTD5xDOWrUBbwkYwkOxRsODHlfFTXk/hoHWUI5/QYQRrmDJRITPTAIwlIfQkAsRJfKmcn084P54qbLj8fCwNkcxOS2OxEA+tiTz4NCIdDfQBByC8hMOunUg/wmp5Ek5zx/sxPOPBnKA8so5PKEO+BVSpB2nc1yL95BItLgI7fiAwGae1joMgMd+PpwpbN8BbLoDkg87paEsR2pALfwBHzXZh2dfDvXO+QCWQ76jS2AuwbTcTz3SER1CuHysHnlTpBSx1AMHiS8bHfJQnLEySVBWTaBDMJyDTjWDE4waNSZbpr2HHflgKGsshHApmL16SHOjDztsQWpeXHZWS7MjainypK8mVchwzyqFA8Z/H0HoAu6dnSDYcHpJ9fPqx5qc0C7OkELALIfQ+MK0dlZBXyHkNu0CaJNIIDXwIGCGqaJ06mYqHnnUBBo+rC4hNUifJolD5zIYwpiGhERvsnd1QtjlZck7NNLmorlpW15bJvKpiqS4tgLBypRDvS3kwMGw8qhiBkPuHRmTgyJB0HD4iew72yqtYUTzWdEh+3NIjTR3oKDiDNq8oG3KPyF5ogEEIPAfh1BQmIfp4JKm5AaqUMBUeanV+pPJv/z3aNTgM/oBwLpj57rdyPvKpr1nCChwPSpNXSAr05Qc64SxMkkVgciNGn2DUnT6/SK5840xZu6JaFs6aLqXTsFSYhBuA0Pe098hzje2y/rl98sP6Q9qjZpXl6mu53RA0tT2VgfJzEnVlrCjVM3azsrr24R3xQYSpmJ3sMAcjTJ3tPy4vgDmezXCi9BvOFE6hHK2zcwPBdg/LB9ZUyJVnzZc3La2SyhKaUoFDYzE40RwcVgnOhhFHKqetC5pIFhTkZsui2aX6vOP0BXLdzg65d/MuueEJ7PhBsvNxVBgHZGQ/wu6tWyrMxzOdDWCj4Zkcg+oDFe3yNY2wNuRjKw0mekAKmSLN8sxPVo55frqFdZ6wggpB4dZA/XbDWGrc1y/vWl4q111UJ2tXzpZCCIOOhxbYidk2OpwtQ4znEbngZ4OYFwtrQpCmRYJyhDRchCnEq7dTFlfJG/C8/+wOufORJrnxMQgaqnsxNocaQRyLmq5jmck5R/dR41D6g3ayzYrANSpS8aHbooehonUZoW+SoKIr5oIjmSP7aAkmaZxn6RZBuA0wgqgT7/zzxfLuMxZKEeZUOhpLJlRtThBxMkUzGZ9AwMQT1wmYQBY5LmlxHkY092R9m3zmZ/XySHOv1M3Ik04Q2gk6TuhoJq3YoMo6fECy+jCl6ClXJnIdjE5j9pW2SdvCkD3WNGYoRJBgjWaahZllMJZm8aCYwloZyzPcEZIS4ZnrQghnFoTagFH7/lXl8sX3rpJlNeWKZIQHypBvjNdRp1VT4HynzYiqH/3RQkwJAlarpcf5QYewNNZho5qbfGesmCU/m1cu39+wVT71ixa+YZc5kG7rCVfZaBUaaLK01joVrU2nQrPhzeYlsmG8eGJesvLGMoM1PwaL2iM8XlAKppaA2KZ9A/L1dy2Qq96xEgcG8Y5aJ1cMZnDaMd0J1DCbGub865pqIkUMgvNrZA5lyc7AcmPbSxa58tZprM7y4nz55HvWyKracnnrD16GcEXm48DETqjsyY1ko9talKav3di1zskw1h68OkKEea4tDqP2YgPyM9Ks8BjAWAtfV1ZCuDSPdncOyn9fuVIuOXuxYuOopWBJLBk9nkM+UShsTIDxTdTyAAJa50AAu7d1EiayS5iQrUqOaHY0eHLxm+bLS5VF8o7bn5Gd+H5oYXGuNOMDgWNfSun4Cwg6Co9tTTGjQnGDUj6OE+oj5hqLgtpobSgbO3UP1XJFJCs6CFXXDuH+6sNrQuGSoU64YDobQwJjnpLOuI5wpqMtEESUwmCYuHtx6rCrb1Cf7oEhGeQOl4NTVU+VT9gQBxF6TpVCECdeksGzx6sWVMrGv1sra7Ch0kwhw9LnR2PQMVPKr3hZBCxRwQWyVCbpXjRJTXQBF8fMYD5swGVtKsN+XiI+P+7DujBZgQ0kzLujkQ58XPXgR07B6KgNR6oyFEyjANRZVYhT4Hw4uC0fAozu3Hc40th6CJsX3dLa2S8thwflIL7SwEpfinF6tLYYc2dZgSyaVSxL55ZK7czpUl02LZzXKWirjnWyDnPUIFoXyKFm4fr7vo+9WS761lPSACHXwMJ2hxcDeq3ghP7kVXRYRUC8p6JJDB5T2WME5rVQsfhxPxxWkSLgw1o4KrNhUDXuPyJ3//WqOOGSkfEqmXQ6BvOFAWPsANS0Dbs6ZOMLrXLXC/siD+/EbjK3HzkpYlTxSLCqMVJFYK6/cAZNtzVRd/nMArlmVaVc/Ia5sgbf4/qWutMESYQMNDx2TCHXVk+XX1x9miz7xpOyG9ugVaivnZqH9aXtjlFFq6zQHmUnOcLH8TZScdV/YidrRHeyeBQzmpUro9OrAAOGsNv63ThtQtMDJBn8vmYJmNGwd0C+9ReLon/37tU6LEmejUgTsC9skkbG09VjM+JHG7fLjb/D+bJemGnFOTKnICeKXcaIyhEw3J6mqqZjMe7wmOwxK0jzIITdg7IQyntXlslHLlgkZ508V3KxxenXz/I6glE+Zrahg4F3nEaeqt8rZ3x9s8zChkgX8GKBN/VO5YRPjPClQ9aRboxRdivX1kjF1d9zW5UUJADtROVUCtZaTIu5FqOn5dCQ/A0+l/m3q87UnSSOTM6JykhvBJuA2R4Kt6NnQO586FX5+K926IjkdmIRBILTKdHO0dEImcsu4D+IBk13PuSpTS1FPaXo02RNEzsJhH3V6dVy7btWyvJ5OIQI59OlSB0PtSOSVqPrRw9tlb/8wSuyZE6hNKBnsSOl545RRWuLIGCsgbOO9EDAaEjgsgvf9GdfOIIuTIaqg/T1q0G/BS4Dv0GLwjyWsTQCJcaZltpxT7kDdY9CyHdfdbpUlRbqS4BsCC9x1JhwiY3Cfbm5Xd7/3afktsfbZDZGywycItwPjdwBdYn3u9oYNpMPI5oAn87i9A3mCKRzGNI+BHpm4nvoWXgD9WvcZPDtR1tkTXmOrJiPU4ugl3Ozag6/2cCo9BE3YJbXVkj7vk7ZgPLzcYSVOGMsJwWp3DGqaKUFNAwNBF+gxFrt7l5IbL3Wj1JxjfAjFjbfCE6MW/pYn6qTGxnD7Ufkv/9iGQyV0hjzEsB94TK86cVdcvLXHpfN2ARZgVHSCeHswPKEBpQ1Dd04fWJQnwmd6pv7zI2YnxeW58oMqPv3fPd5+da9z+tVFhSuM8BiTFNlDRo4SJjHN1ef/NOT8MoySzphrXMffUqdNjVoLtWIOvrkB4iyh7u3rqsHQEfHowDxxB5tHBpVDd2DctkbK+Xta+u0UFh9Agp/NP9yc5Oce8vvpHhalswH8+sxd2LgJqhBEK6bYg4R6yMMpwT6jI/nKGRuhjZDvQ4ivByvIa/56Xb58p1PyxEIXoUMRrKz+U6nFPQwCnnJ3HK5492LpRsdmAcKWO+UO9LjlhOBTLO0HU6mqJ3kagdQ+fo9IbOkcZ7T3WQsWz7+tmUyLdilUtUXVOWPWtLEvEde2CXv+OYzMmtWgZ6+2Alm4/NzR3McidEIGcoXh9wV49Ed7rVr+9CrMUClF0i7IGkKm+mJjq0njb0A2AYj9KSaQrnh/h0yHSr32vecAoMqNo0Yp4iDtZjyeOeZi+TNj+2UzQeP4GqTbN2zJszUOFIRTwnrgYlIQtlEKhrnh4ChtP2CiYiIhs5g/HxLi+XTUKFq3oXNjI+eWi2nLJ2lpdn5dKQiXzHAp5Btztu2u0PO+/dnJFKFs7+APQDVRwG4GqxOGjouZV52VnQGRtN+nA1uwcdYTXv7pLG1Dz7WxBhV7VjKzKLwgcNZ1zEcDquLkyvctHgF8KfWFcmnv7dVfvNsi9IcVKVh+2H9pqrLi/Ll+gugnTqOSBlo4QaIjztj4RAvqTAZOj9HexvCNr2br5UTJnSOcWE0YG0szpAPY2HzXT7xY/Et2EqSS89ZqMszE6IKx0lahavMghC6+o7I9f/1DNCPyjy8IuTI5XagXx9jXApVQT3gY9fozo5+JEXkInySc0ZtKQyxQpmGt1B92NHac7BPfrG9U57HyQ2B5T0dy7RuMAmrqjicpJg4KJgVeHX49K5e+cf3LpAz8KpScwgOp6PW2m50BXnnrKmRRbUN0tA7JBWopwu4gixXOBO/QGhcVp8VqNDJa5rUEV9RcUST6Mw7Vl4NgTVjCfJOXO6yevFMrUR54kJhpTYSmfDj326V9S926ly4FR2Dh+oC+sNSXE8vAAN3cHOjfzDy2bPnynvWLZQlNRVSUhh/yoN0XIclVv2Odrke11U82XlEylH2sLY7vuWctynceoz8T507V/73pafrRWRxSyalIvgBHcTveBzFymCaXL+uRq6+a5uUYWrpIsKMO3Ya1ohHmWl+MBWGFGnFBCaJcEapi03q1zUYexDoT/tgXL3/1DlSjPNSviBN0L5qbmztlKt/0ShVs/KlBcdpuCnlWOjIIV6O3EUQUCNU4dLqAvnBR0/DgYC5MeoDprMEOwbrqSjGeS3M/U+CFr5rppomLnOGdzks4fo9vfKp82rkhsverMLlea74OZhVxTtrA+s6axXer6/fjo01aolgCooHz0DMk5uHDeymY3P8RxORNJbwIOcoPOJwD4XTRQsHa8zTlru51zGcdZtz86gJ+6ePbsctb8N6rLU/wGP42BE5cuuAuBGj8H24fmLj9edRuIqMqp8diLWT4eYY3vh8i7zpxk26XVkJLmB7IMh2jCLeFRDuVszb10O4X778zariidOE60ZNAm5iAX7Wa1XWzSmTy3GpzV6oadbF5Zy1IbO+Vs6f0Ll1MMUcJ18jgHAWPlbf1cVJgIZGOxp52ZJSmT+zVDPIhHAUswoQAt6oQFr2dck/PrZb8ipysTYNLGYt5cjlWnoeliBNeJFwydJS+T9XnyWzK4plBLDAGTGr3OogXqZtemGnvOWWpyQP69xqCPEgNkdo2bOtZIMJtx6G2afOmys3QLgFuXwf7ZZITnjsXkpwjH7FwB+XjpAaidQUF67CdIS2Y3XnsgmSySegxckRrQjkierI4SBmqZmsmD0ZD3t+EavBNuC6JZWqHkPBkhNwWq3HnM1bWtUCnYdjO70Y+ZrFHzwsWw58u2Dd8r7Mmy8/XSpw+I7CzcZGA0Yp0WlH0XIIU7iPv7RLzr11s+Rj96sSa8b9utQKRhxKDIHO5TDk6ndDuOdAuJetDYQL65hrzGN0K2srMSFmyQDa4SwCbS2wufZo44K2BQ1NnWdw1kM0TsJMjrEwVwBJnFe5ITlm3wmO+7G22c9tPzpjvNKFOMcEHQUxMDQsD+DNEDaXpQ9Md+rO5bMZXOeWc9hhjXn/B1bJAmgEPRQA4fodR8MoRrW86YUWOetfn5Sikmwpw7y7l1oByDgSiXMIVrqqZcy5159Ptbw2VMukyccLcMVJ31EVi9t0oD4Rw9VUl8h82Ad7YCROS5z6CJP4aKkk6T6cD6NUkBIfAO/FlXN+mhXKpI96ud5sxWjBmkRqqkpC7DqPkS6ljUx0Wa3t3fJ/Gw5JGd6tHoKA9dvlAI4wXMM2Hh6OXrKmUs574wItpPvphgAtpUAY5Zd3FO65//Kk5Jfk6F2P+0LhEtAZas5axsh9Cwyqv8LI1Q2YmFpW3jny9MUDVTaFyHrpWwcwn5WTtXSlMOourikWDGE9b6ZkBu1RgGMN++VYmy9LhN0cDOI0hz4f1p7JB9Ljt0OD2FY8tTwf1+BS3K7KsP+zWpeqvy1t+G750KCOUs6JLpcM43iLulHQPRi5dF1tuBNG2gkZjCBFF6rlbzwFtZwrFRD2vnAHDPiAm/iXYyjX74a1jKVQvHCdWlacwMipBqSqUKmyuUY+0NWnAg/qVfr5owTQB0w+boRdUl2k76jz0KNcJyAEHuQ76GMIay1WDmhCCTOsew4BZ0m1zsVMZoWZdVSF2K2X5bhaoCCPG4yOFAol1FhoKPsX3Y62w9pwJSuBHuxlQUigEScaVy9ya2mWUfGigGOeG1WbYC2fi5fwRdAcxXFq2dXPJRbVMpdC158/T264gq8s3QE/CpCciAZTBAVo9FGoLzXul3uebJZOjMrbP36e2hVKh9LgKNcCKE++z6mAgGkjIDyKRnOGIf7MONbnOxeP/7KB1VkLFDYz1bOD5rKFmH8WluXrgfKQFGRqLUFVZCKDLQewy4S9yNg2oitBa7wYo3A/jLVL6kplZjmYBufIRlniAwLIJqLCvflxya/Mg3DRKXy1jDJOuNzEgFoeI1yHS4WK+ui4o1a/44A8/Pxu+fZzbbIHnYLNKsT9Yrcgj9YyaXcd1jWIJbksQtfApge+wNDpBnkkciocGcEnQB8IOKiJ1DDH6uaI1rTJUUKmq6LDqJuGzQ2tRRtI5K4yFWzQaKrBjh5crgnGahKuvDI6GOf9E/ygt6asUHKDrxtCnMinWn7i5V1RjNxIPkZ5BaS9l2qZnQf5rFXVMneoaC1TuH9lI5dzrjPUyCfuWL2686C+orznuVbZ0ICpgyRDIyybPU03L3bCkh+CdlLHPNKnhLsk+81HB2DtHNCqLUkIHeOJLsxLkknC/EI+iJUL1GJwJgupJnW/sAEnVn4U8RgKUIFG+wIhp5XhWmcMKTvEIL62YK/Q8R3qcMAYQqQFYz8sSFwU7qbnd8i5tJan06CitRxsb6IEi+s6N5/ChVq+YD7WuRCuGlRuKaRaQKuKSE/fgKy8dZNIM/6MwaxCWTAjX1nFl/jNECqnC2qmQRMw42OcIzoH8zAuItMRrV/XGJy1yeK+nzTPlyiAFSZI00EZK4SXDWBiEDc/hj8BUSwj7VAMg6sEgyPmKBE4MjTRxafEYpQ1p1++AG7rGpDhYVycGiyNOPJUuF97DGq5YIxaZndRtUzh7klUy97IVZrwA5L5cqIG5YbxFSO/wNwNNc/q2Zo8/KZYZyJ3rNO2s6A2J7F7joV3KY5vqXIT02MydOWCZRIiHEX64gE+GT7mAaq00uLL6uDzyg1zqRQ6RwSjVNHmGM6j6gUz9QQ7dJr6QM3+0cftThhGP9vbg297+7UYhfv4SztxGOAJKVC1LBGzlslQlh8GnuXYs67f2SOf5lKII9czqIjIp4PxdhhTu7ENSlvgIGhne/RPGSBOn2t0Wku52MRI7QADN0y68ZAWNdwQJT7Gxz6WxzoTH8InpKneRyUqR8rSPY4qVz9yXYCsdg9NA/vHtMR/ydLiYYBK66JP6QxR9XrOMZS1xRzXreW43FqZoXQaNQ6Gn2/WQcCDbf3SjJcRdA8/2yxn3fyoquVSjGhuYvAaITr+mlreSrV8Ya186YqzsImBE6RgjL+JAV4HXNCiDj8MOl7xEDsh6ejhymAIAqvETlouOoo6V6VyyiXEfoexecM2cYqOdw6fo9TCBmFx32eeH0eYUToVIX/cA6o8QM1kXAMEz4jT0UPOQa22dx/RkaQfnHvcZJBODTIIprYK1jE/AwkIdbnul6BOD0Tl2YZ9upFxPoQr+LqAc+5+zLkUrilBfpm/QtUy1rkXYs69Yp23ieHtfCkNjhAKnSN+40vYTcOpfOKIctQEnYZQ/ECuE/Pv+fNLZPo0nY2Vm2OnHMf9nn68uSLliBptrkXj/DpyxgGwLAN0dVmq63ZMsydkuhUw0GP3qYa4x8vD5w0d/TIwOIRXhW5H1rCScazR1pzzcZCcUwLJUbPTo5vBVg6nynz58qMt0r6hEfuW+VIN4VIt81YdYzLn3OW0lnEQ/tMQ7hcvjxcusIRC0zAYoZsZwNG056Dc8nSbzMBNgO2Y+FXdKUGABN48DkWsgZfPKtFrIlg+mQv6hLR19iE7OKXCdmmLk5U4xjQyho/7USSgGSlKAXMYZVxrR5y+PYRPDCemJcYDeODjCODG7+/b+6RXe3LQPGs9iiptRAG3EK/YpCxP/1aQbpKEdTucPEPJ3bF2GFkz8rPwt4UQVrVMvA7GqWW88tvdI9dfNF++dOXZnlpWcWldhA/lhoCp0Lse3ooJH50Rw2BQdUbQHuJHm7LJJ4zgNQsrlXZ2jJjDVIW2saNZE3cfgCWO3seP7CwtBp+pkM9FZ7MEnEYFbKVPo5LNAlYoMUyi/LTEuOXh5QHwzsYI3ndwAPcYYxODjtUFnKXvM2POjOly6eIy6cC7YB6cA0tQgA+dm+f5p0KoJvuAh4foeLDOkY/5EgFVy1jnfhpz7g1XnO2pZcd4YtLqtZArqUICHhpsn7+/EVMFXhDo6LX6Xd083sM3XHy3vXIhvgQJXExwyHMokRORbnTqZ3djd64wW3BvjNMGVihTPutLeDwrmnSgEXzY6gw/PFg+jUODh+D2OsPIb5dvbFHQNIAuXo2zT3jXy1Mg3HBQmjhKsMnP81lubh9VA4phSxtC/jKzli+YJ1+EQRV7ceDNuWGT3WizV4172g/L5d/fjM2MHFzPBF0R1Ef8pIFvrSrQlDb8caoPLiuX2lnQNgEuDQQ/PO9GsugOwhq/Hx/CZUHbEKfjr2uHw5ss7No0Nj8xHXHiNPl5vtNTIJa9LNQbAVFMzZSjGqRq4vLmme37dVqlIeM7o8uYsm71fFXT+2Fs8fC4I9PoZMweYnFhjtyFEO6rO3rkOmxifOnKc+LUsmkMQptjmr1qbOvokau/sxHHfwb0qwQegne35Hl1gdAi0n4Y26VrF4T4iY+ahu1Q5/GxcTduv8GrzVrQRo3jnOFM5RMqWV5iusOmv8bEwHcCDiv0ABPH+iTjmCLxCQd6GV7X/fjl/XLgkFPTrJq0kMnKfCQogxBfNKdCvnj2PDl8sF8NKL6vJQvHe+ZgvmzGJ6hfxH0eN191vo7cYVjVVgcKqyMWqmN75ccPx7bDqLrk6xvkFw2dUleai9ObtMZZW3ydZRiZ2/GN8cLaIjlrTa1DSDnQaTtckL/aFvi/27pX99aJaySNdozXxvHzUBnJDRwEDMqUClIYPCDSqZDM+r1g6EJYtNvw59hexaa9uoAYqmhT0/TNXrnk3OVKHz/Y5s7RRHTRCqfjDbod3bRaGcaMGeD3fWoQbpAMQpAPbm6QJTdukMf39MgiWORNeLVJO991OscHTgNcDVQBt7T2yw1vXSZVZUXaUfRdtNbmflgPKaHPN093vYDbeWCNH8J8zs4+UTuOPp84A/mhTpNl8D44jLv0hB6LkgCgoz+5h6/JuB5+8Jkdape6TQZF7n5Uhs7KJHNXLqiWf33PctmNNz4LMJxoGTvWJaeDGxyzoSU++4sGqf7cevnBL5+TbbvapRcjjrK3UhTqvs4eeejp7fLhf31Q3sZ1NOaxGhhNjdhX1ne2IbQrRaNuNmjfirX82avL5Z3rloU0hy1Q5iJmFSH4YkOrvNDcJXVYT/dM5eiNydXkS1b7qSSTlNExPdElS0uESR1n6XbMaWUYITc9vkv+5u0dUgc1TIXh+EI17epgz6dhxdhlb1sjdz+3Rx7b1xd8PY+XFilIQYOwi4UjMrB++SH2FbfhwHzJi/KnsMiXYb1aXJiLETsqezv65I6WLhnCtiUs4ejC2YURXoe0R9fRZo3Ht4XvwfRDMpzrvvmDp0sZTmm4g3gxw42j3MnW7ZDxzwX+7Ams07HRQvvAuRTEW/Yx+YY8HneOJuOHfI0DIdenwPVhGl0EQ+sQPl156OkmqXs3PssM6mGNFLSKFfW7T0BGcZNdoXzryjPklM/9SvpRdgZUK4XhDIixRFK1tkIVVmB/uGJeEWyhUbkPd1BKPQwdTuOskHvHvNBs3jQu4SK8coEMyFXLVykBkPMJTs2xBELasr1bbv/Im+TNJ81DZ0TBYMSqSg54pp0T2oD+qy0H5NtPtspc7I/zgF9M+xAr8dMlCzONLhWMyw1/tW6DdXQzzy2TaBGSUHtIOBBPxUMGctNeqvPlww9uk70Hu3WrUXePtKGuuaRFGYg5knlvWDJH7v/EOjmIz0emg1Se0NT8JHSSKdzipDpswkYEP0uZje+Ha/GGaQEOvi3A6J6HTZRyCLkJtLRhlGlbOX3AAXXQdudzk2YlhQvL/LN/vkT+6u2nKJzCkg79B1jSjETSZXPy3Y/U69lr7nrxeI/D7eNPFTb+Mz8ZjOWbTzpQP2nwnuSDQBuqpJLcjD+H0bsXgWE4CS73btoC/GgAGQUGhI+mBo1jC5H39jOXyU8+uVaasDM1A8V5N7Sd1ExFZw7awrmzHXW2wpreg7mXTxvC7ADsCO6VX/J2OuFmySuo8xrshv2vy87GjqvrdG7UkjZMdAHtLg240KCXGtvkCxuaZDY+mOMWqu58TQE/HasoXnOxEFhEzjIheFRXMw1JYTiASZpmeen73AVqw9q2srpQPrp+Ky5PcX9nDzzSUUAygS0WZo9kIn7fe/5quevjEDKuEixDejEe3X0aQ2s8PfxcONkzto2xcry2g/vYW1p65Zrz5suNf/sWrHnjD8BTkPhPYpVmHb3oAJx7v/fAi0o1T5IcUQsvhnu8emN52uRADhamn4jH5ZF/yrnQ12OzLg2tD7hKYMdOMjT+QXRMWiJMenHubHGPF5c2y3fue0bf3DiLGj1ROca6nCPTYqMlKu+7AEK+bq20tHTrpyC8gkl3ujJEG9s4iNG9ArtOW2GEfQIbJl/58Pn6gsQ3qpTOgFekkUJWH2Q/DOv8G7/ZIYvwQmQPhI33IHDp8SYGZ2VoOPhlGfefIE87GrLUJz1qpyCmDKW2Vio0Ix6hjzwzYR5Z4WegSzEffuOBZtnw1KuoH7X6DAvClk6Gsll0TshnQl33Yl3qrvKnKs4E3TjuFXX72Bi5EO5NEC63TrnbFTuvFROmdUBqEua3dXTLJT/8Hd524aYdlpkUXdrcCX6s3QTz5Al+UaqOJxrgDwAMfop9mvBqcM0ukHfc8TvZtR+3xOj85ixQVp/o1LKm4PGokFVdd0Nd47QlgMM9a4VBQgDr2uTKJU8jLF4OQUj6RSG0w8eplj/khMuRa7ftkSafNqddKFw3QG6772npxolL/g3BdnRizs/J60+kJ914QACJCB8GAqdBF4+9bHDj2kGQoFjJKQtzZu3EuriWBhe2F2/60RN4V4y/1kUhgwZVgaidvioZUoJ0Ctm1AUK+cI3c9cl10gILl/dc8u0SpzvnwgBLWqLn+2nulSZH7tad3ZFPXLhA/vmqC8ao5bCw0udiZJdpnl8+sVU+/7NXsc06DRfD4FCekzkA/bpCLMcYIC7/8dCQUcosVhyR7IIzP/AFGgBq1isxYOzIELKIgAmZJMwjRINQIVDVvEppGbbxHnzugMwpisppK2pCQNJKBtKZwC2sFALgpLqZsnJmntz260apKc3Ty1Y4x7ulSnr088/qxNTyguhXPnxBxB3piallq1d94xDqt0vQtjTvk3U3PyQl+LCNx4qGppR3pMJ3mFdysBXD6/xVtvgBbUlUNAppl/R9hqfiAVL858ZEM9ari3By8WPff1Ye+n2DCtONClI71oXzXiB9HcnXYE5u7nHqWhnv8E9Eu1nL9bjS4Zq31MpNH7ogbs5l7U6LxGjh2pdpproPHu6Tq7+7EZBRHD7AbQHotLRbJ6o7M/nWTpUsqcXjHASMCAh1iYGvhPGHzqj0w+OlWV46fgwnD6MewjyXi7PHF976iLzcuDduPiYknVuMOD9U19ohA3X9qUBdQ+vzdh13yNWVTfbLda5ay5hzqZa/ctWFUlSQiz/o6eZcU70UaNCXFI0TLufdLFytNCJf+sEj8ijeQi2ZnoeLSHE1JFl5XB06VJL6gpcNyGIuBa0+wwZtCYxb2PxkaZaXjh8rT0Koqqu5hQir+Lxbfi3NezuUgbReyVAym92GzkLhSHbJbk6GkJtwBkuta5RLZV074eK8FnbHrrlogdwE4apaBlIKzoQbVOhqBQ0qXPi6rEPqN3/yuNz6qyZZhnm3AZrIzbvpdPBMwbjGc3nsZIiAylJVNFPpPJ9dNXywMOEbEI0nhglnaeP5Pr7UYarqPTBMFuKT0YN44f7Xt27Ae+NetV5NyKhQqU38UcOLNMK978I3yF3XQl03pbKuYVCZtYzrBq85n0shJ1xdCpE5KZx1tMBglh/+8mn5+/96SZYtKMbfcBoe84pRyVXeASHJC/mamg9xMLQYx5QxPOY7GJ0SQtrZBpuDEfSdNo/EqHOAycNMtfxUPmGIbOKHo5K9n5+ELMEbp41Qedd9Z4N09Q6okKk2yWBzfthGso46MESF/OmzpAVzMq3raShHXlHF06Di3vJWzLmfuHihfOXqi6GW88L5FDjCSmxKYJ0mXFd/RO55+EW5/JtP4ZqkImnBRK7fMGs7jUL6bHcyF1aBzNRhNpe5pMP5Fqfv1LJfWqvzqszOP/ODakU7ZgEUI5KXWjoLIRlhU5/G+Yt3cizFC4GN9R3Ssb9dzjtlAU5nxDYbfCp8QasQyBBw5qS6WbJyNqzrXzXIXFi2/DyMh/NWYrtxyy6M3AudcBOtZZQli+L4png5kpgB3Pc/vkX+7KsbpQaGYRd6Dj6Vg9Wu2SfoB7TxD0TzbwirIzFcJq1zAo4tkyhgfA7i9YKgxHH1uIvJ81ArcJj9wZfbpfvgQQh5oeTjCwLbUTKCyHCTB8MmDPoq5Jn5ctv926UKQp4P4b6y4zDm3Dqo5Yt05BKfv4nh8MUEbPhYH8MPPrVV3v6138pcfF3I5RBvqYVNd2JZhs4Xzc3XpZIucckT9NNAwNb7kAhiI4P83mdMJ0ba8XUUcht2glaUF8gvn90nvZ0dck4SITuB0Pghfc4YM6Ew6aRFszGS8+U/N2yX/Z0Dcu3bFslNCWqZJT2H4oos7CzMY9oGCPdtN/5GZs4sxEWlEb0qmBonNh6ON9+C+qhdIGAdwSEJOoIvjW10sBWqot0HXYyeaEfm8VUbbwa4H0LuOtguZ6+JV9fO2o0JJBQuBADTTwXDkbykMkeq8Ybjqx99q7OWMXLNWjaBsr0IAyXeqqK8w+1wPPBkvfwJhFuGpRzvyjrhfxArFA5nfxyGysUH5tlU0YiCdrpI6d/fHz0Mo8YdDUXKCLYKe9oBY0Bhd0CmH2Zxc5ZuvqWn47MMHQlKXp4qh4bRcqjX+l098qFz5snNH32blBbh2iRTr1RRxKINQxgRF3b705yCeEMdz2LxS3z3YsBGu9XPZusySFFxu9Tthon8/NGX5d1fexg33RaClfjGCjYCj/AQ8IQ7tnkUf3BkGv5wWAG+6QJPTMBuJyuRQnKHlMf5fhrD/pMM1s8fL8yy45dnVeyX9QPDsqKmSG57ZKdcc+v9wt0jzp20rq1BAINz8zBDFJgtoTjq9JoFpnkWEfEnuIgv3Ht++4K8+0u/kRoIl+eq+ILkNSNcn3fW3dzgZeuDrcrQnghzwCNrtWJQ4EASJyRsS6h6rDWX4ZzVHZv3yF/fvF5a8RUC1SxHsgoZ0lK16kktGJWa7odde2KijeXhb5OoJhC581dPy1/c9FuZV1ssfWBYF6YwnhLhv+PHD9Jo9SWEncEPtcN8yC88DMAiWVH3Noll2CDKN2iY4mN66Dzhj5sWZqYR8HH6Yb9oLJ1N4Dr5VZyWXDanSNZvwd9t+Op6fc3oj2RtgrXDQ+VWkmg3hO/Udww3wZhG1W1Fb7/vSbn0lkdl0aISPdfF/WWeRiEdSV0oA8NL33+SlkqRiHKGj511vDClyny6sDoEcITFqWhrkeYCSBES6QSI4/JZ7mifVPh9PPEwFA5sRXkV6nrJjAJ5rLlT3vnle2VH68FQXZMsczYPM+5GneOBhQ2Ovs3L+C44cuuPN8mHcP3SUtw3zeNFvTyVQRzjtdmQhTCk3X+IIN3HAInUwr7PdDqkWR2MUpb6uLB72cAME66GLeoj9MME8uPHM8ya3Y5XA94dL4J1/WJbj6z+wj2ydUdbaBWrIEglGx9QqwELK8kuj53Ara3dFYpfveOh6LX/8XtZurREdsMAHUR9nLIzr5aBkv9TPqTY0chQvLNymqp4OHgt5uQZblUGWTqSGSa8ITZEmfJJguHyw5aW6CfABNkkLx/0NmJzvw7bmt2493nF5++Vl7a3xglZmwQUYeOJzhwynVp2Gx08bHDD7Rvkc3e+JCtwe20LRq5+SYG6lB2JpE06HqjWSeHRwto8hrSlXmODt0kuXfP5A0jO2VPzOHvA4fbDqepLgAFxnHB00gHXsfKTJszJC/CXP3HLiayGkJ+p36lCZjsomFBNU6CAt7mYTaUFTiOtd2BQPvOdX8pX7qmXlXXFkW2YAliYc5jV99r0Pb6xQdpA/LiGkv4g5PnKPEqAHJr0w1qnzpHCAjSBt8HPL4KQ0aJTP3evPPFikx6od0ImFBwE5lqEDgJhO7WMv23U3S/X3fpzHP5rkBV10zG/j0RTfRrjEGXqV5mcCWRoFlsWyFLflbgwtkAYoHP904XxqzzRnzDp2ALEMbWPzcm7IOQa/PkawVcM6z6/foyQbST7arkTXyB+AsK9bVMLvtQvgYU+rN89WVeYWtp5hd84vKH6GS8/zDM8hI7JkzKNV9GsjvlErI8ftrRM+pnD76zrKC5nGZG5+MiaVytQyI+/0Kgj2TXJjVxTyx3YKPnYLevlh/gQbgWu+t2C2wd0oy8Khilvra3GZ8Z9mi3s+wabAR8oQhlqvePHbeDSt4dTDJxJnaEgHKpoBzE1v6Q6c47Y+ME276Wcgy8SeJ/kWf+0Xh57fjvmWcgMAKaW27t65SNfv0/+HzZMls8r1l0yqno3ctl4nzaGLW4+6baw7zN8vB9WaDRQfrEnmINJrCUy7MGHxAbpISJDyPSpdlYXfXuS18lcCrkNBhdHcjbeKZ/9hZ/L01taVMjcEDnU0y+f+MbP5SdPt+JP9RTLVqhlJ1zDafVZ/LXsKz/QYviJZCMe7GQhn+sJe7QMGhXnIxLGLUz/eDykxeo0ulLXS3VNVbsXy5zZPOOFI0Cnwbre0rQXd08OyScx595JtTwXwoW1TEtc18uxtrjhHosfp3amblNqPhs/4EOEoQwZgTzxyhVImRGKH/FQkpZOAKbTWVgLuSTNs/QgKfT8dD9MAIvTp2MdfphpPozRwHRzyeEJydvu+CXhfFxdtBOj9OpvPoBb14vl+4/vxBFdCncII5fTreE1XEzgLBbGgc2HYZh55iM4Jp9pBuOHDWdiWT/dh2fYd8lwMt/oQ1BRuTgEzJgh55QchD2guMIhIg8hSsXDaELw48P5Yb+Mn+6HU8Gkwu/DkyK347ULI3lOab48ur9HHt3VJQtwEoPnsLmvHROuX9b4kUiLD2N55htNfjxZOFmajzcZHktLhPNwUduoY6PwUBsjKRAwc5joPM3RAkx4fTs2m3vX+2Bdz8CcnIfDdrsgXL3L0ngyponeDeRj8qYigYQk8jpZWqq6AWttCWXoUOJvPMJi1GuEWVgrgc5C2hj82i0MTVBTsrQgKy3PL++H/cJ+uh9OB8bBk2icDIl0s1V4I8Q/bOka4uNjmI4WNIOJeUyn89NdythfH8YPj4WM4SMcHeuxcFCly0jIMzijl9n6z5EflOEcDMSGiHXwsYUzw34e0xOdEZOYnk7c6iKsH/bL+ul+OBUM040mH94P+2W1Yi+BZX1hWpbhZNwPW36i78P44UQ4xv18P5wI6+dZmD5lhEc9RtkEVzanDBdvd+FML3d33N0Obh7mhdOED+AcAlcmg7+swZwftjT6frofTgWTKn1sWZcS2/uJlTTmxVImChFXjFcTQWc6HzUrAXyhSSocJfzNOrWyQO8YLMri/eUAywJQll6+g1bq8Eey9Wg/niotEWa8OBtq+X7Y0uj76X44HRgf3g+7so4Vhof5dH58orDlu8shJi4bg4/B+mmOApdnYd8nbKJjGkWEXeccNak4TnUQcz8g581ziiJ3b+FfGMt2t7BBwDhfG4kM4ZY4QsaPICYkuKPv7fEI/PJ+2Ify0/1wOjA+vB+2solpjAdMS6k6E8sYLt/3YfywD5MqnAo+WTrSMDSj2bjihScqcRqUEyn+dAiOGEHAK2tKsX+3Rzel9aoBGFyjBcU4WdmRuiOloitpOjtdkn6RFDadxCSdOJ1iRwWTjJFHhSCDwMa7cfiIE5XRAlygjq8aeFiQVy3y70p96KRyyVo2ryzKm972Y8otgJrmiI0WlkWjOfkI6FqJmDXd+Tqkx0nz8xlWtRLAJ+Yx2dL8sKXR99MZToYvEcbKp0pPlZ8KPlW64Un0jwae7bHH2GH4iEdnTkUYhJHG095MCnyAjBbhyCy2YaF1oyU8ftI/Kn9yUlU0a15VceRyvODu6RuO4O/78sQ3VDS+jy3BjcijQ4HhbdYze7b/oI64uJ+XTtgv74f9sn66hUNLgt0bDz1LSyecCtbK0rcwA6nChifRPxr4xLamLGttNNrgQ6A8Dw2NG53m/gQCrrCI8JMf3up78sKKSFY+9mrfeyou3u4b0T8Zxz7BS0NGp1dD0DhEPcw/joBKrSP9f+GjQ78u2glpQZajZXNpGOulcPwmuhv3WF+/ulLqcDcn10TRs0+eHV23qCS6rX80Sv2NhQMssvzoSNUCFEeYxw2do+/S1NfkII3pR/v45f2wj8dP98PpwPjwfjgsy1YxA0/ghQEfPlU4LGSFA/9o4Q2PofHjFo7zIRbIZRh/z6liLtRzKaQEYcMoxrFeqGCRD5w5Tw/8Z0F2kemFuZHPXVgbkcNDkQr0APRfFB+OjBYWR4ZnLkJvZo/Gx5dU2KqSqbKpWuh8FXO0Yb+8H/bx+Ol+OB0YH94Ph2WRaGHm0zFuzs9LFrY03ydv6CzND1taKl8LpihLvMZ3SHBoIDKCkTtSNgsiHdGLZxZjK7ap80jkM2dWyxsWz1BkvIuCX1npTXP/dOeL8s9PHZCluMBrGzbosaqSUSybsvq6JHs/Tkbwu+FsnHvShZb2UqPodexnuh1e/wi5wjqYbnWNF2Yhg2fYXFAG346R/yOV8yDc2YqV93XyTwrt53c1EPKua98kNZW4qBzpNKroq8z4R6ve+e1nZPOBAVmMU4rbKWTgpZAjQ0ckuwPLqW7c1D7KSrghwkqp5f/opo4DEA7VLz/NgRstLJXRyhr1s6Blh/HeoBLGMS+c2d05FH3y42tk7bIqmlG64RGOYDvVv21Plyz71nO8xlUW4/AahcwNMJrg2q8GeiDkdh3VOqJhxcV6JgH/EBzmsThVfaLaBKmR79jAiBaUyGhJJaxl/IUXpEFwqpY5cvMgzd1tR+TuK5fJe86sDVa3jmbMzTqAMYLddzk8u1S/65C84/svS3MHDpPjz6LvxuXa3bCzgMuNXJalqsAkHxnGn2v7gxSyY9AJ/eVbPgo3FztUejUDBIDRTJXMWXIxVkANOBMuPSNyz6VLon++dr7b1QLRNoviM0nMwZzz4Wh+UV1TyHs7++Xz/10vtz/bIXmYk/nnYHgd/2EAcJnFr+8iIMAVdeUVSaZ/VG1kEmlaCNMCyiRVSXFRkMyAz9v06PgnBbgUoo5pxq35ubhJftMHl0EtVyucEg7ZuD0qCNoETOEqMmSauu7HS/J7nmiRv9ywG3dJYj2MPxS1EFfsUim3QcoY2K6MKm+t/yh/WCNJOh7O6jKfdSaGmaYs0p8YbYlwQXZK2pPBE/dEjuXojCcuzkFUjUHHW+75V9gG8DcjuIn1uTOr5OqLF+HPBUyLCRTyM0ch6xzMdjLZ3R7E4R8TMoF3H+yV+3/fKjc/fUAa98GSpnFVlC256EkUdgwlof/oMsUBE3MOBDWIrUfcKo4rdXPkM/iLL+9bO1fW1Lm/d8EBSblSbipUEKBdEHEn4IAiAtApUADMuKUfODyAv+LZJU80dMgdWw9JPTa0eWiNe11/WO61YWRxfUJzeBBz7TV1JXIB/ozeyQvKZcHM4nBQmbalBuZ/E7LJ438AnlwIn++YiV0AAAAASUVORK5CYII=')",
    		'background-size': '100% 100%',
    		'background-repeat': 'no-repeat',
    		'background-position': 'center',
    		'display': 'inline-block',
	        'padding': '6px 12px',
	        'margin-bottom':'0',
	        'font-size': '4px',
	        'font-weight': '400',
	        'line-height': '1.42857143',
	        'text-align': 'center',
	        'white-space': 'nowrap',
	        'vertical-align': 'middle',
	        '-ms-touch-action': 'manipulation',
	        'touch-action': 'manipulation',
	        'cursor': 'pointer',
	        '-webkit-user-select': 'none',
	        '-moz-user-select': 'none',
	        '-ms-user-select': 'none',
	        'user-select': 'none',
	        'border-radius': '4px',
        };
    
    	
    
    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        
        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        this._auth = {}
        this._publishButtonCss = publishButtonCss;
        this.init();
    }
    
    // Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		 /*--------------------------------------------------------------------
		 * Function to Initialize the plugin
		 *-------------------------------------------------------------------*/ 
		init: function () {
			
			
			
			if(!window.name){
				window.name = 'vueventParent' ;
			}
			
			var self = this,
    			strButtonID = '#' + self._defaults.buttonID;
				vueventPublisherHandle = self;
				
			self.dateConversionFormat = "MM/DD/YYYY HH:mm A";
			self.dateDisplayFormat = "MM/DD/YYYY HH:mm A";
				
			if(window.name == 'vueventPopup') {
				
				window.opener.vueventPublisherHandle.publishEvent(false, location.href);
				window.close();
				
			}

	    	//Add button to container
			var publishButton = $('<button id="vueventBtnPublish"></button>');
	    	
			$('#vueventPublishBtnContainer').append(publishButton);
			publishButton.css(self._publishButtonCss);
	    	
	    	//Assign click to the button, this will initiate the publshing.
	    	$(self.element).on('click', '#vueventBtnPublish', function(e){
	    		e.preventDefault();
	    		
	    		//open window that will authorize the user
	    		
	    		var authData = {
					'client_id': self.options.clientID,
					'response_type': self.options.responseType,
		            'state': Math.random().toString(36).slice(2),
		            'scope': 'read write',
		            'redirect_uri': self.options.redirectURI
		      	};    		
	    		
	    		if (self._auth.access_token){
	    			self.publishEvent(true, null);
	    		} else {
	    			var url = self.options.authURL + '?' + $.param(authData);
					win = window.open(url, 'vueventPopup');
	    		}
				
	    	});
	    	
		},
		 /*--------------------------------------------------------------------
		 * Function to parse the url query result from the popup.
		 *-------------------------------------------------------------------*/ 
		getQuery: function (query) {
			
			if (/\/#/g.test(query)){
				var paramStringList = query.split('/#');
			} else if (/\/?/g.test(query)){
				var paramStringList = query.split('/?');
			}
			
			var params = {};
			
			if(paramStringList.length == 2){
				var paramPairList = paramStringList[1].split('&');
				
				$.each(paramPairList, function(index, pairString){
					var pairList = pairString.split('=');
					if (pairList.length == 2){
						params[pairList[0]] = pairList[1]
					}
				});
			}
			
			return params;
		},
	    /*---------------------------------------------------------------------
		 * Function to handle the popup that will be used for authorization.
		 *-------------------------------------------------------------------*/    
		publishEvent: function(hasToken, result){
			var self = this;
			
			if (!hasToken){
				params = self._auth = self.getQuery(result);
			} else {
				params = self._auth;
			}
			
			console.log(self._auth)
		    	
		    var baseURI = self.options.baseURI;
		    	
		    $.ajax({
		    	  url: baseURI + 'events/',
		    	  method: 'GET',
		    	  crossDomain: true,
		    	  beforeSend: function( xhr ) {
		    		  xhr.setRequestHeader('Authorization', 'Bearer ' +  params['access_token']);
		    	  },
		    	  success: function(result){
		    		  
		    		  var data = self.getFormData(self.options.fields);
		    		  
		    		  window.open(baseURI + 'event/?' + $.param(data));
		    	  },
		    	  statusCode: {
		    		  404: function() {
		    			  $('#vueventConsole').text('NOT FOUND: Could not find the url location.');
		    		  },
		    		  401: function() {
		    			  $('#vueventConsole').text('UNAUTHORIZED: There was an error authenticating you.');
		    		  }
	    		  }
	    	});	
		    
		},
	    /*---------------------------------------------------------------------
		 * Function to generate a dictionary of mapped fields and their values.
		 *-------------------------------------------------------------------*/    
		getFormData: function(fields){
			var self = this,
				data = {}
			
			if(Object.keys(fields).length > 0){
				
				$.each(fields, function(field, value){
					
					var field = self.options.fieldMap[field];

					if(field){
						var fieldName = field.name;
						var fieldValue = $(value).val();
						
						if (fieldName && fieldValue){
							
							if (field.type == 'datetime'){
								var convertedDate = moment(fieldValue, self.dateConversionFormat);
								
								if (convertedDate.isValid()){
									fieldValue = convertedDate.format(self.dateDisplayFormat);
								}
								
							}

							data[fieldName] = fieldValue;
						}
						
					}
					
				});
			}
			return data
		}		
		//--functions//
	});
	/*-------------------------------------------------------------------------
	 * A really lightweight plugin wrapper around the constructor,
	 * preventing against multiple instantiations
	 * ----------------------------------------------------------------------*/
	$.fn[ pluginName ] = function ( options ) {
		
		this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});

		// chain jQuery functions
		return this;
	};

})( jQuery, window, document );