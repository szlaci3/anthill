import { Request, Response } from 'express';

const checkSubscription = (req: Request, res: Response) => {
  res.json({
    data: {
      company_name: '15002244333',
      link_man: '15002244333',
      phone: '15002244333',
      email: '15002244333@rr.tr',
      address: '15002244333',
    }
  });
};

export default {
  'GET /Customer/SocialSecurityAgency/subscription.html': checkSubscription,
};
