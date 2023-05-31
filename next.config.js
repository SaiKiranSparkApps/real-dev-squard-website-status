module.exports = {
        async rewrites() { 
		return [ 
			{ 
				source: '/progress/:id*', 
				destination: 'https://dev.realdevsquad.com/progress/:id*',
			}
                        //'Access-Control-Allow-Origin': 'dev.realdevsquad.com',
                ]
        },
	images: {
		domains: ['raw.githubusercontent.com', 'res.cloudinary.com'],
	},
};
