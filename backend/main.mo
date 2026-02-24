import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type UserRole = AccessControl.UserRole;

  type ServiceCategory = {
    id : Nat;
    name : Text;
    iconUrl : Text;
    order : Nat;
  };

  type Service = {
    id : Nat;
    categoryId : Nat;
    name : Text;
    description : Text;
    price : Nat;
    duration : Nat;
    imageUrl : Text;
    active : Bool;
  };

  type Address = {
    id : Nat;
    name : Text;
    userId : Principal;
    addressLine1 : Text;
    addressLine2 : Text;
    city : Text;
    state : Text;
    zip : Text;
    phone : Text;
    isDefault : Bool;
  };

  type UserProfile = {
    principal : Principal;
    phone : Text;
    firstName : Text;
    lastName : Text;
    email : Text;
    role : UserRole;
    referralCode : Text;
    walletBalance : Int;
    savedAddresses : [Address];
    blocked : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module UserProfile {
    public func compareByCreatedAt(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Int.compare(profile1.createdAt, profile2.createdAt);
    };

    public func compareByFirstName(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      switch (Text.compare(profile1.firstName, profile2.firstName)) {
        case (#equal) { Text.compare(profile1.lastName, profile2.lastName) };
        case (order) { order };
      };
    };
  };

  type UserProfileResponse = {
    principal : Principal;
    phone : Text;
    firstName : Text;
    lastName : Text;
    email : Text;
    role : UserRole;
    referralCode : Text;
    walletBalance : Int;
    savedAddresses : [Address];
    blocked : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  // Stable storage
  let userProfiles : Map.Map<Principal, UserProfile> = Map.empty<Principal, UserProfile>();
  let categories = Map.empty<Nat, ServiceCategory>();
  let services = Map.empty<Nat, Service>();
  var nextCategoryId = 0;
  var nextServiceId = 0;

  // Include authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  let approvalState = UserApproval.initState(accessControlState);

  // Private role-based guards
  private func requireAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Administrator privileges required");
    };
  };

  private func requireUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Authenticated user account required");
    };
  };

  private func requireAdminOrUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Authorized user or administrator account required");
    };
  };

  // User Approval (required by frontend)
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // ── User Profile Management (required by frontend) ──────────────────────────

  /// Returns the profile of the calling user.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfileResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can retrieve their profile");
    };
    userProfiles.get(caller);
  };

  /// Saves (creates or updates) the profile of the calling user.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    // Ensure the stored principal always matches the caller
    let sanitized = { profile with principal = caller };
    userProfiles.add(caller, sanitized);
  };

  /// Returns the profile of any user. Callers may only view their own profile
  /// unless they are an admin.
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfileResponse {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ── Address Management ───────────────────────────────────────────────────────

  /// Adds a new address to the calling user's saved addresses.
  public shared ({ caller }) func saveAddress(newAddress : Address) : async () {
    requireUser(caller);

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedAddresses = profile.savedAddresses.concat([newAddress]);
        let updatedProfile = {
          profile with
          savedAddresses = updatedAddresses;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  /// Marks one of the calling user's addresses as the default.
  public shared ({ caller }) func setDefaultAddress(addressId : Nat) : async () {
    requireUser(caller);

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedAddresses = profile.savedAddresses.map(
          func(addr) {
            if (addr.id == addressId) {
              { addr with isDefault = true };
            } else {
              { addr with isDefault = false };
            };
          }
        );
        let updatedProfile = {
          profile with
          savedAddresses = updatedAddresses;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  /// Returns all saved addresses for the calling user.
  public query ({ caller }) func listAddresses() : async [Address] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list their addresses");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile.savedAddresses };
    };
  };

  /// Deletes one of the calling user's saved addresses.
  public shared ({ caller }) func deleteAddress(addressId : Nat) : async () {
    requireUser(caller);

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let addresses = profile.savedAddresses;
        let updatedAddresses = addresses.filter(func(addr) { addr.id != addressId });

        if (addresses.size() == updatedAddresses.size()) {
          Runtime.trap("Address not found");
        };

        let updatedProfile = {
          profile with
          savedAddresses = updatedAddresses;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // ── Service Category Management ──────────────────────────────────────────────

  /// Creates a new service category. Admin only.
  public shared ({ caller }) func createCategory(name : Text, iconUrl : Text) : async Nat {
    requireAdmin(caller);

    let categoryId = nextCategoryId;
    let newCategory : ServiceCategory = {
      id = categoryId;
      name;
      iconUrl;
      order = categories.size();
    };

    categories.add(categoryId, newCategory);
    nextCategoryId += 1;
    categoryId;
  };

  /// Lists all service categories. Readable by everyone.
  public query func listCategories() : async [ServiceCategory] {
    categories.values().toArray();
  };

  /// Updates the display order of a category. Admin only.
  public shared ({ caller }) func updateCategoryOrder(categoryId : Nat, newOrder : Nat) : async () {
    requireAdmin(caller);

    switch (categories.get(categoryId)) {
      case (null) { Runtime.trap("Category does not exist") };
      case (?category) {
        let updatedCategory : ServiceCategory = {
          category with
          order = newOrder;
        };
        categories.add(categoryId, updatedCategory);
      };
    };
  };

  // ── Service Management ───────────────────────────────────────────────────────

  /// Creates a new service. Admin only.
  public shared ({ caller }) func createService(
    categoryId : Nat,
    name : Text,
    description : Text,
    price : Nat,
    duration : Nat,
    imageUrl : Text,
  ) : async Nat {
    requireAdmin(caller);

    if (not categories.containsKey(categoryId)) {
      Runtime.trap("Category does not exist");
    };

    let serviceId = nextServiceId;
    let newService : Service = {
      id = serviceId;
      categoryId;
      name;
      description;
      price;
      duration;
      imageUrl;
      active = true;
    };

    services.add(serviceId, newService);
    nextServiceId += 1;
    serviceId;
  };

  /// Updates an existing service. Admin only.
  public shared ({ caller }) func updateService(
    serviceId : Nat,
    name : ?Text,
    description : ?Text,
    price : ?Nat,
    duration : ?Nat,
    imageUrl : ?Text,
    active : ?Bool,
  ) : async () {
    requireAdmin(caller);

    switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Service does not exist") };
      case (?existingService) {
        let updatedService : Service = {
          existingService with
          name = switch (name) { case (null) { existingService.name }; case (?v) { v } };
          description = switch (description) { case (null) { existingService.description }; case (?v) { v } };
          price = switch (price) { case (null) { existingService.price }; case (?v) { v } };
          duration = switch (duration) { case (null) { existingService.duration }; case (?v) { v } };
          imageUrl = switch (imageUrl) { case (null) { existingService.imageUrl }; case (?v) { v } };
          active = switch (active) { case (null) { existingService.active }; case (?v) { v } };
        };
        services.add(serviceId, updatedService);
      };
    };
  };

  /// Deletes a service. Admin only.
  public shared ({ caller }) func deleteService(serviceId : Nat) : async () {
    requireAdmin(caller);

    if (not services.containsKey(serviceId)) {
      Runtime.trap("Service does not exist");
    };

    services.remove(serviceId);
  };

  /// Lists active services for a given category. Readable by everyone.
  public query func listServicesByCategory(categoryId : Nat) : async [Service] {
    services.values().toArray().filter(
      func(service) { service.categoryId == categoryId and service.active }
    );
  };

  /// Returns details of a single service. Readable by everyone.
  public query func getServiceDetails(serviceId : Nat) : async ?Service {
    services.get(serviceId);
  };

  /// Returns active services for a category. Readable by everyone.
  public query func getActiveServicesByCategory(categoryId : Nat) : async [Service] {
    services.values().toArray().filter(
      func(service) { service.categoryId == categoryId and service.active }
    );
  };

  /// Returns each category paired with its active services. Readable by everyone.
  public query func getCategoryWithServices() : async [(ServiceCategory, [Service])] {
    categories.values().toArray().map(
      func(category) {
        let servicesForCategory = services.values().toArray().filter(
          func(service) { service.categoryId == category.id and service.active }
        );
        (category, servicesForCategory);
      }
    );
  };

  /// Returns the first `limit` categories. Readable by everyone.
  public query func getTopActiveCategories(limit : Nat) : async [ServiceCategory] {
    categories.values().toArray().sliceToArray(0, limit);
  };
};
