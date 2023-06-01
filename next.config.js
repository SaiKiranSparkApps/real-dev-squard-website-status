module.exports = {
        async rewrites() { 
		return [ 
			{ 
				source: '/progress/:id', 
				destination: 'http://dev.realdevsquad.com/progress/:id',
			}
                        //'Access-Control-Allow-Origin': 'dev.realdevsquad.com',
                ]
        }, 
	async headers() { 
		return [ 
			{ 
				source: '/', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: 'http://dev.realdevsquad.com' //'*'
					}
				]	
			}, 
			{ 
				source: '/progress/:id', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: 'http://dev.realdevsquad.com' //'*' 
					}
				]
			}, 
			{ 
				source: '/tasks/:taskid', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: 'http://dev.realdevsquad.com' 
					}
				] 
			},
		]
	},
	images: {
		domains: ['raw.githubusercontent.com', 'res.cloudinary.com'],
	},
};
